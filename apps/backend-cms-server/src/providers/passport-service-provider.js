const LocalStrategy = require('passport-local').Strategy;
const { admin, role, userRole } = require('shared/src/database/models');
const { Op } = require('sequelize');
const { hasSuperAdminRole } = require('shared/src/helpers');

module.exports = class PassportSerivceProvider {
  static register(app, passport) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
      done(null, { id: user.id, user: user, role: user.role });
    });

    passport.deserializeUser(function (user, done) {
      done(null, { id: user.id, user: user, role: user.role });
    });

    passport.use(
      new LocalStrategy(
        {
          usernameField: 'username',
          passwordField: 'password',
          passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {
          admin
            .findOne({
              where: {
                [Op.or]: [{ username: username }, { email: username }]
              },
              include: [
                { model: role, as: 'role' },
                { model: userRole, as: 'userRoles' }
              ]
            })
            .then((response) => {
              if (
                response &&
                response.dataValues &&
                response.dataValues.email
              ) {
                let adminUser = response.dataValues;
                if (adminUser) {
                  if (hasSuperAdminRole(adminUser)) {
                    if (!admin.validPassword(password, adminUser.password)) {
                      return done(
                        null,
                        false,
                        {
                          message: 'Incorrect Email/Password'
                        },
                        false
                      );
                    }
                    req.session.user = response;
                    return done(null, adminUser);
                  }
                  if (adminUser.status === 'active') {
                    if (!admin.validPassword(password, adminUser.password)) {
                      return done(
                        null,
                        false,
                        {
                          message: 'Incorrect Email/Password'
                        },
                        false
                      );
                    }
                    req.session.user = response;
                    return done(null, adminUser);
                  } else {
                    return done(
                      null,
                      false,
                      {
                        message: 'Your account is in in-active state.'
                      },
                      false
                    );
                  }
                } else {
                  return done(
                    null,
                    false,
                    { message: 'Not authorized' },
                    false
                  );
                }
              } else {
                return done(
                  null,
                  false,
                  { message: 'Incorrect Email/Password' },
                  false
                );
              }
            })
            .catch((e) => {
              console.log('local passport error : ', e);
            });
        }
      )
    );
  }
};
