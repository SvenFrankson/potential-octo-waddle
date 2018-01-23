using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public class ScoreData {
	public int[] scores = new int[17];
}

public class ScoreManager : MonoBehaviour {

	public int[] scores = new int[17];
	public static ScoreManager _Instance;
	public static ScoreManager Instance {
		get {
			if (!ScoreManager._Instance) {
				ScoreManager._Instance = Resources.FindObjectsOfTypeAll<ScoreManager> ()[0];
			}
			return ScoreManager._Instance;
		}
	}

	public void Start() {
		this.read();
	}

	private void read() {
		ScoreData data = null;
		string filePath = Application.persistentDataPath + "/Scores/scoreData.json";
		Debug.Log("Load scores at path " + filePath);

        if (File.Exists (filePath)) {
            string dataAsJson = File.ReadAllText (filePath);
            data = JsonUtility.FromJson<ScoreData> (dataAsJson);
			Debug.Log("READ Score " + JsonUtility.ToJson(data));
        }
		if (data != null) {
			data.scores.CopyTo(this.scores, 0);
		}
	}

	private void write(ScoreData data) {
		if (!Directory.Exists(Application.persistentDataPath + "/Scores")) {
			Directory.CreateDirectory(Application.persistentDataPath + "/Scores");
		}
		string filePath = Application.persistentDataPath + "/Scores/scoreData.json";
		Debug.Log("Save scores at path " + filePath);
		string dataAsJson = JsonUtility.ToJson(data);
        File.WriteAllText(filePath, dataAsJson);
	}

	public int GetScore(int index) {
		if (index < this.scores.Length) {
			return this.scores[index];
		}
		return 0;
	}

	public void SetScore(int index, int score) {
		if (index < this.scores.Length) {
			this.scores[index] = score;
			ScoreData data = new ScoreData();
			data.scores = this.scores;
			Debug.Log(JsonUtility.ToJson(data));
			this.write(data);
		}
	}
}
