
var bleService = 'cycling_speed_and_cadence'//GATT service requied in sensor 
var bluetoothDeviceDetected

document.querySelector('#Connect').addEventListener('click', function () {
    if (isWebBluetoothEnabled()) { connect() }
})

//function to check if browser support web-BLT API
function isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
        console.log('Web Bluetooth API is not available in this browser!')
        return false
    }
    return true
}

//Function to find and connect to BLE sensor supporting specified GATT service
function getDeviceInfo() {
    let options = {
        filters: [{ services: [bleService] }]
    }

    console.log('Requesting cycling speed and cadence Bluetooth Device...')
    return navigator.bluetooth.requestDevice(options).then(device => {
        bluetoothDeviceDetected = device
        console.log('device detected: ' + bluetoothDeviceDetected.name)
    }).catch(error => {
        console.log('Argh! ' + error)
    })
}

//Run when pressing connect button
function connect() {
    console.log('Web Bluetooth API is available in this browser!')
    getDeviceInfo()
    
 }