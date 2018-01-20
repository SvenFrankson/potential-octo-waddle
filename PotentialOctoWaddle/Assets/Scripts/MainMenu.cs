using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class MainMenu : MonoBehaviour {

	public static MainMenu _Instance;
	public static MainMenu Instance {
		get {
			if (!MainMenu._Instance) {
				MainMenu._Instance = Resources.FindObjectsOfTypeAll<MainMenu> ()[0];
			}
			return MainMenu._Instance;
		}
	}
		
	public void Open() {
		Debug.Log ("MainMenu Open");
		this.gameObject.SetActive(true);
	}

	public void Close() {
		Debug.Log ("MainMenu Close");
		this.gameObject.SetActive(false);
	}
}
