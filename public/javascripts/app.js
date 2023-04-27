const queryParamsString = window.location.search
console.log(queryParamsString)
if (lastPage === 'true') console.log(lastPage)


const searchForm = document.getElementById('search-form');
console.log(searchForm);

const scanner = new Html5QrcodeScanner('reader',{
    qrbox:{
      width:400,
      height:200,
    },
    fps:10,
    showTorchButtonIfSupported:true,
    formatsToSupport:[
      Html5QrcodeSupportedFormats.UPC_E,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
      Html5QrcodeSupportedFormats.QR_CODE,
    ],
    supportedScanTypes: [
      Html5QrcodeScanType.SCAN_TYPE_FILE,
      Html5QrcodeScanType.SCAN_TYPE_CAMERA]
  });

  scanner.render(success,error);


  function success(result) {
    document.getElementById('form-input').setAttribute('value',result)
    document.getElementById('search-form').submit()
    console.log(result);
    scanner.clear()
  }
  function error(err){
    console.log(err);
  }