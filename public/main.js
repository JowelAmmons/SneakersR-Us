
var trash = document.getElementsByClassName("delete");

Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const user = this.parentNode.parentNode.childNodes[1].innerText
    const style = this.parentNode.parentNode.childNodes[3].innerText
    fetch('/special', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'user': user,
        'style': style
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

