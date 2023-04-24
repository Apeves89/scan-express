const scanner = new Html5QrcodeScanner('reader',{
    qrbox:{
      width:500,
      height:250,
    },fps:20,
  });

  scanner.render(success,error);

  function success(result) {
    document.getElementById('result').innerHTML = `<h2>${result}</h2>`;
    console.log(result);
    scanner.clear()
  }
  function error(err){
    console.log(err);
  }