$(function(){

  $('#global-search').on('click', function(){
    let data = $('#global').val();
    let url;
    switch(data){
    case 'app_users':
      url = '/app-users'
      break;
    case 'news_and_update':
      url = '/news-and-update'
      break;
    case 'meters':
      url = '/meters';
      break;
    case 'call_center':
      url = '/call-center';
      break;

    case 'events':
      url = '/events';
      break;

    case 'charging_stations':
      url = '/charging-stations';
      break;

    case 'transaction_logs':
      url = '/transaction-logs';
      break;

    default:
      url= '/';
      break;
    }
    const form = $('#global-search-form');
    form.attr("action", url);
  })

});

