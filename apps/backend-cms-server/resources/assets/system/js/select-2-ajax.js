$(function(){
  populateDropdownData.init();
});
const populateDropdownData = (function() {
  const init = () => {
    registerEvents();
  }

  const registerEvents = () => {
    const select2Items = $('.select2Ajax');
    $.each(select2Items, populateData);
  }

  function populateData(){
    let url = $(this).data("url");

    $(this).select2({
      language: {
        inputTooShort: function() {
          return translate('Please enter {key} or more characters.', "", [2]);
        }
      },
      ajax: {
        url: url,
        dataType: 'json',
        delay: 250,
        data: function (params) {
          return {
            search: params.term
          }
        },
        processResults: function (data) {
          return {
            results: data
          };
        },
        cache: true
      },
      minimumInputLength: 2,
      width: 100
    });
  }

  return {
    init
  }

}) ()