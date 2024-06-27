$(function(){
  mainEditForm.init();
});

const mainEditForm = (function(){
  const employeeEditForm = $('.adminEditForm');
  const button =  $('.submitAdminEditForm')
  const init = () => {
    registerEvents();
  };

  const registerEvents = () => {
    button.on("click", handleSubmit)
  }

  const handleSubmit = function(){
    if(!employeeEditForm[0].checkValidity()){
      employeeEditForm[0].reportValidity()
      return false;
    }
    employeeEditForm.submit();
  }

  return {
    init
  }
})()
  