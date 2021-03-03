using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;

public class UnityToJavaScript : MonoBehaviour
{

    [DllImport("__Internal")]
    private static extern void Connect();

    [DllImport("__Internal")]
    private static extern void StartBLENotification();

    [DllImport("__Internal")]
    private static extern void StopBLENotification();



    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void ConnectBLE()
    {
        Debug.Log("connect button pressed");
        Connect();
    }

    public void StartNotifcation()
    {
        Debug.Log("start button pressed");
        StartBLENotification();
    }

    public void StopNotification()
    {
        Debug.Log("stop button pressed");
        StopBLENotification();
    }

}
