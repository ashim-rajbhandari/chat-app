const { queueConfig } = require('../config');
const { emitter } = require('backend-cms/src/listener');
const axios = require('axios');
const emailService = require('shared/src/services/email.service');
const emailServiceInstance = new emailService();

async function pushEmailToQueue(payload) {
  const emailData = await emailServiceInstance.buildEmailPayload(payload);
  try {
    await axios({
      url: queueConfig.queueEmailUrl,
      method: 'post',
      data: emailData,
      timeout: 10000,
      headers: { 'api-key': `${queueConfig.queueApiKey}` }
    });
    console.log('Email sent successfully:\n');
  } catch (err) {
    console.log(
      '🚀 ~ file: email.service.js ~ line 32 ~ EmailService ~ sendEmailToQueue ~ err',
      err?.message
    );
    emitter.emit(payload.code, payload);
    console.log('[Sending Email from Application]');
  }
}

module.exports = {
  pushEmailToQueue
};
