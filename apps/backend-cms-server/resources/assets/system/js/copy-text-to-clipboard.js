const { success, error } = require("./toast-partials");

$(function(){
  copyToClipboard.init();
});

const copyToClipboard = (function() {
  const init = () => {
    registerEvents();
  }
  
  const registerEvents = () => {
    $('.copy-text').on("click", handleChange);
  }
  
  const handleChange = async function() {
    try {
      const textId = $(this).data('text-id');
      const text = document.getElementById(textId).innerText;
      await navigator.clipboard.writeText(text);
      success("Text copied to clipboard!");
    } catch (err) {
      console.log("🚀 ~ file: copy-text-to-clipboard.js ~ line 23 ~ handleChange ~ err", err)
      error("Error in copying text to clipboard!");
    }
  }

  return {
    init
  }
})()