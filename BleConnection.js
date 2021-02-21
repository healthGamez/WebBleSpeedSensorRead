
var bleService = 'cycling_speed_and_cadence'//GATT service requied in sensor 
var bleCharacteristic = 'csc_measurement'
var bluetoothDeviceDetected
var gattServer
var gattCharacteristic

document.querySelector('#Connect').addEventListener('click', function () {
    if (isWebBluetoothEnabled()) { connect() }
})

document.querySelector('#Start').addEventListener('click', function (event) {
    if (isWebBluetoothEnabled()) { start() }
})

document.querySelector('#Stop').addEventListener('click', function (event) {
    if (isWebBluetoothEnabled()) { stop() }
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
    getDeviceInfo().then(_ => {
            return bluetoothDeviceDetected.gatt.connect()
        })
        .then(server => {
                gattServer = server
                console.log('Connected to Gatt-server')           
        })
        .then(_ => {
            console.log('Getting GATT Service...')
            console.log(gattServer)
            return gattServer.getPrimaryService(bleService)
        })
        .then(service => {
             console.log('Getting GATT Characteristic...')
               return service.getCharacteristic(bleCharacteristic)
        })
        .then(characteristic => {
            gattCharacteristic = characteristic
            document.querySelector('#Start').disabled = false
            document.querySelector('#Stop').disabled = true
        })
        .catch(error => {
            console.log('Argh! ' + error)
        })
    
}

//When pressing start, start notification of bike speed measurment
function start() {
    gattCharacteristic.startNotifications()
        .then(_ => {
            gattCharacteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged)
            console.log('Start reading...')
            document.querySelector('#Start').disabled = true
            document.querySelector('#Stop').disabled = false
      })
      .catch (error => {
        console.log('Argh! ' + error)
       })
    }

function stop() {
    gattCharacteristic.stopNotifications()
        .then(_ => {
            console.log('Stop reading...')
            document.querySelector('#Start').disabled = false
            document.querySelector('#Stop').disabled = true
        })
        .catch(error => {
            console.log('[ERROR] Stop: ' + error)
        })
}

function handleCharacteristicValueChanged(event) {
    const value = event.target.value;
    let a = [];
    // Convert raw data bytes to hex values just for the sake of showing something.
    for (let i = 0; i < value.byteLength; i++) {
        a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
    }
    console.log('> ' + a.join(' '));
}