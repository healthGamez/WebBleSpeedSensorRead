var bleService = 'cycling_speed_and_cadence';//GATT service requied in sensor 
var bleCharacteristic = 'csc_measurement'; //GATT characteristic desrited
var bluetoothDeviceDetected; //Device object
var gattServer; //GATT server object
var gattCharacteristic; //GATT characteristic object

//function to check if browser support web-BLT API
function isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
        window.alert("Web Bluetooth API is not available in this browser!");
        return false;
    }
    return true;
}

function getDeviceInfo() {
    console.log("Requesting cycling speed and cadence Bluetooth Device...");
    return navigator.bluetooth.requestDevice({filters:[{ services: [bleService] }]})
	.then( function(device){
        bluetoothDeviceDetected = device;
        console.log("device detected: " + bluetoothDeviceDetected.name);
    }).catch(function(error){
        window.alert("ERROR " + error);
    })

}

function connect() {
    if (!isWebBluetoothEnabled()){
		return
	}
	
	console.log('Web Bluetooth API is available in this browser!')
    getDeviceInfo().then(function() {
            return bluetoothDeviceDetected.gatt.connect()
        })
        .then(function(server) {
                gattServer = server;
                console.log('Connected to Gatt-server');
        })
        .then(function() {
            console.log('Getting GATT Service...');
            console.log(gattServer);
            return gattServer.getPrimaryService(bleService);
        })
        .then(function(service) {
             console.log('Getting GATT Characteristic...');
             return service.getCharacteristic(bleCharacteristic);
        })
        .then(function(characteristic) {
            gattCharacteristic = characteristic
        })
        .catch(function(error) {
            window.alert("ERROR " + error);
        })
    
}


//When pressing start, start notification of bike speed measurment
function start() {
    gattCharacteristic.startNotifications()
        .then(function() {
            gattCharacteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
            console.log('Start reading...');
      })
      .catch (function(error){
        window.alert("ERROR " + error);
       })
    }

//When pressing stop, stop notification of bike speed measurment
function stop() {
    gattCharacteristic.stopNotifications()
        .then(function() {
            console.log('Stop reading...');
        })
        .catch(function(error) {
           window.alert("ERROR " + error);
        })
}

//Called when notification recived from sensor
function handleCharacteristicValueChanged(event) {
    const value = event.target.value;
    const parsedCscValue = parseCscValue(value);
  //  console.log(parsedCscValue)
    SendMessage('JavascriptHook', 'getSensorReading', JSON.stringify(parsedCscValue));
}

//Parsing function for CSC value
function parseCscValue(value) {
    value = value.buffer ? value : new DataView(value);    // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
    const flagField = value.getUint8(0);
    var result = {};
    result.flagField = flagField;
    var index =1;

    switch (flagField) {
        case 1: //Sensor is Wheel revolution sensor
            result.cumulativeWheelRevolutions = value.getUint32(index, /*littleEndian=*/true);
            index += 4;
            result.wheelTimeStamp = value.getUint16(index, /*littleEndian=*/true);
            break;

        case 2: //Sensor is Crank revolution sensor
            result.cumulativeCrankRevolutions = value.getUint16(index, /*littleEndian=*/true);
            index += 2;
            result.crankTimeStamp = value.getUint16(index, /*littleEndian=*/true);
            break;

        case 3: //Sensor is Wheel and Crank revolution sensor
            result.cumulativeWheelRevolutions = value.getUint32(index, /*littleEndian=*/true);
            index += 4;
            result.wheelTimeStamp = value.getUint16(index, /*littleEndian=*/true);

            result.cumulativeCrankRevolutions = value.getUint16(index, /*littleEndian=*/true);
            index += 2;
            result.crankTimeStamp = value.getUint16(index, /*littleEndian=*/true);
            break;

        default: //This should never happen
            console.log("error, undefined flagfield value:" + flagField);
    }
    return result;
}