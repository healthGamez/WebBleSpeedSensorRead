using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class JavascriptHook : MonoBehaviour
{
    private Text cumulativeRoundsValue;
    private Text lastTimeStampValue;
    private Text speedValue;

    private void Start()
    {
        cumulativeRoundsValue = GameObject.Find("CumulativeRoundsValue").GetComponent<UnityEngine.UI.Text>();
        lastTimeStampValue= GameObject.Find("LastTimeStampValue").GetComponent<UnityEngine.UI.Text>();
        lastTimeStampValue = GameObject.Find("LastTimeStampValue").GetComponent<UnityEngine.UI.Text>();
        speedValue = GameObject.Find("SpeedValue").GetComponent<UnityEngine.UI.Text>();
    }

    private void Update()
    {
        
    }
}
