export function error(msg = "Something went wrong."){
  $.toast({
    heading: 'Error',
    text: msg,
    showHideTransition: 'plain',
    icon: 'error',
    position: 'bottom-center'
  });
}

export function warning(msg = "Something went wrong."){
  $.toast({
    heading: 'Warning',
    text: msg,
    showHideTransition: 'plain',
    icon: 'warning',
    position: 'bottom-center'
  });
}

export function success(msg = "The update is complete."){
  $.toast({
    heading: "Success",
    text: msg,
    showHideTransition: 'plain',
    icon: 'success',
    position: 'bottom-center'
  });
}