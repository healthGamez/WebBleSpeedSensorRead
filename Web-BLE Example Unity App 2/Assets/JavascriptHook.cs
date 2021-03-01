using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class JavascriptHook : MonoBehaviour
{
    private Text cumulativeRoundsValueText;
    private Text lastTimeStampValueText;
    private Text speedValueText;
    
    private uint previousCumulativeWheelRevolutions;
    private ushort previousWheelTimeStamp;
    private ushort previousCumulativeCrankRevolutions;
    private ushort previousCrankTimeStamp;
    private float lastupdate;

    private float maxRoundTime = 3.0F;

    private void Start()
    {
        cumulativeRoundsValueText = GameObject.Find("CumulativeRoundsValue").GetComponent<UnityEngine.UI.Text>();
        lastTimeStampValueText= GameObject.Find("LastTimeStampValue").GetComponent<UnityEngine.UI.Text>();
        lastTimeStampValueText = GameObject.Find("LastTimeStampValue").GetComponent<UnityEngine.UI.Text>();
        speedValueText = GameObject.Find("SpeedValue").GetComponent<UnityEngine.UI.Text>();
    }

    private void Update()
    {
        
    }

    public void getSensorReading(string readingJson) {
        SensorReadingJsonObject sensorReadingJsonObject = JsonUtility.FromJson<SensorReadingJsonObject>(readingJson);
        switch (sensorReadingJsonObject.flagField)
        {
            case 1:
                cumulativeRoundsValueText.text = sensorReadingJsonObject.cumulativeWheelRevolutions.ToString()+" rounds";
                lastTimeStampValueText.text = sensorReadingJsonObject.wheelTimeStamp.ToString();
                if (previousCumulativeWheelRevolutions!=0 && previousCumulativeWheelRevolutions!=sensorReadingJsonObject.cumulativeWheelRevolutions){
                    double WheelRoundsSinceLast=sensorReadingJsonObject.cumulativeWheelRevolutions-previousCumulativeWheelRevolutions;
                    double timeSinceLastRound = (sensorReadingJsonObject.wheelTimeStamp - previousWheelTimeStamp)/1024.0;
                    double timeSinceLastRound2 = (Time.fixedTime - lastupdate);

                    if (timeSinceLastRound>0.0 && timeSinceLastRound <= maxRoundTime){
                        speedValueText.text=(WheelRoundsSinceLast/timeSinceLastRound*60.0).ToString("0.00")+"/"+(WheelRoundsSinceLast / timeSinceLastRound2 * 60.0).ToString("0.00") + " rpm";
                        lastupdate=Time.fixedTime;
                    }
                }
                else if ((Time.fixedTime-lastupdate)>maxRoundTime){
                    speedValueText.text="0.0 rpm";
                }
  
                if (previousCumulativeWheelRevolutions!=sensorReadingJsonObject.cumulativeWheelRevolutions){
                    previousCumulativeWheelRevolutions=sensorReadingJsonObject.cumulativeWheelRevolutions;
                    previousWheelTimeStamp=sensorReadingJsonObject.wheelTimeStamp;
                }
              
                break;
            case 2:
                cumulativeRoundsValueText.text = sensorReadingJsonObject.cumulativeCrankRevolutions.ToString() + " rounds";
                lastTimeStampValueText.text = sensorReadingJsonObject.crankTimeStamp.ToString();
                
                if (previousCumulativeCrankRevolutions != 0 && previousCumulativeCrankRevolutions!=sensorReadingJsonObject.cumulativeCrankRevolutions){
                    double CrankRoundsSinceLast=sensorReadingJsonObject.cumulativeCrankRevolutions-previousCumulativeCrankRevolutions;
                    double timeSinceLastRound = (sensorReadingJsonObject.crankTimeStamp - previousCrankTimeStamp) / 1024.0;
                    double timeSinceLastRound2 = (Time.fixedTime - lastupdate);


                    if (timeSinceLastRound>0.0 && timeSinceLastRound2 <= maxRoundTime)
                    {
                        speedValueText.text=(CrankRoundsSinceLast/timeSinceLastRound*60.0).ToString("0.00")+"/"+ (CrankRoundsSinceLast / timeSinceLastRound2 * 60.0).ToString("0.00") + " rpm";
                        
                    }
                    lastupdate = Time.fixedTime;
                }
                else if ((Time.fixedTime-lastupdate)> maxRoundTime)
                {
                    speedValueText.text="0.0 rpm";
                }

                if (previousCumulativeCrankRevolutions!=sensorReadingJsonObject.cumulativeCrankRevolutions){
                    previousCumulativeCrankRevolutions=sensorReadingJsonObject.cumulativeCrankRevolutions;
                    previousCrankTimeStamp=sensorReadingJsonObject.crankTimeStamp;
                }
                break;
            case 3:
                cumulativeRoundsValueText.text = sensorReadingJsonObject.cumulativeWheelRevolutions.ToString() + " rounds / " 
                    + sensorReadingJsonObject.cumulativeCrankRevolutions.ToString() + " rounds"; 
                lastTimeStampValueText.text = sensorReadingJsonObject.wheelTimeStamp.ToString()
                    +" / "+ sensorReadingJsonObject.crankTimeStamp.ToString();
                
                //TODO implement for dual sensor
                
                break;
            default:
                Debug.LogError("Unexpected json parsing error");
                break;
            
        }
    }

    public class SensorReadingJsonObject
    {
        public byte flagField;
        public uint cumulativeWheelRevolutions;
        public ushort wheelTimeStamp;
        public ushort cumulativeCrankRevolutions;
        public ushort crankTimeStamp;
    }
}
