var trash = document.getElementsByClassName("fa fa-trash");
var request = document.getElementsByClassName("fas fa-shopping-cart");


Array.from(request).forEach(function(element) {
  element.addEventListener('click', function(){
    const user = this.parentNode.parentNode.childNodes[1].innerText
    const style = this.parentNode.parentNode.childNodes[3].innerText
    const size = this.parentNode.parentNode.childNodes[5].innerText
    const request = parseFloat(this.parentNode.parentNode.childNodes[7].innerText)
    fetch('sneakers', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'user' : user,
        'style': style,
        'size' : size,
        'request': request,
        
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      alert("trade Requested")
      console.log(data)
      window.location.reload()
      
    })
  });
});


Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const user = this.parentNode.parentNode.childNodes[1].innerText
    const style = this.parentNode.parentNode.childNodes[3].innerText
    const size = this.parentNode.parentNode.childNodes[5].innerText
    fetch('sneakers', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'user': user,
        'style': style,
        'size' : size
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

