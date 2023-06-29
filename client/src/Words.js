import React, { Component, useEffect, useState, navigate } from "react";
import { Audio } from "expo-av";
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
  ImageBackground,
} from "react-native";
import TextToSpeech from "./TextToSpeech";
export default function Words({
  word,
  audio,
  navigation,
  frame,
  filteredArray,
  edit
}) {
  const [sound, setSound] = useState();

  const [buttons, setButtons] = useState(true);

  console.log(edit)
  console.log(word.id);

  // const hasMatch = filteredArray.includes(word.name);
const hasArray = filteredArray ? true : false
const hasWord = filteredArray ? Object.values(filteredArray).some((w) => w.name === word.name) : null
console.log(hasArray)
  //   console.log(hasWord)

console.log 
  // console.log(hasWord);
  // console.log(word);
  // console.log(word.audio_url)
  // console.log('here')

  // const soundPlay = require(`${audio}`);
  // function playClip(){
  //    const {sound} = Audio.Sound.createAsync(`${audio}`)
  //    await
  //    return sound.unloadAsync()
  // }
  async function playSound() {
    console.log("Loading Sound");

    const { sound } = await Audio.Sound.createAsync(require(`${audio}`));
    //   const { sound } = await Audio.Sound.createAsync({uri: `./assets/audio/oh-brother-this-guy-stinks.mp3`}, {shouldPlay: true});
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  //navigate to word details
  function handleWordClick() {
    console.log(word);
    navigate(`/words/${word.id}`, state.id);
    useEffect(() => {
      fetch("http://127.0.0.1:5555/wordframes")
        // change fetch addres to ip address of local network
        // 10.129.3.215

        .then((r) => r.json())
        .then((data) => {
          console.log(data);
          setWordFrames(data);
        });
    }, []);
  }

  // console.log(word.id)
  // console.log(frame.id)
  function handleAddToWordFrame() {
    setButtons(!buttons)
    fetch("http://127.0.0.1:5555/wordframes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        word_ids: [word.id],
        frame_ids: [frame.id],
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        // setFrame(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleRemoveFromFrame() {
    fetch(`http://127.0.0.1:5555/wordframes/${frame.id}/words/${word.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      });
  }
  const handleButtonColor = () => {
    hasWord ?  styles.button : styles.blue
  }
function handleEditButtons(){
  return edit ? <Button style={handleButtonColor}
  title={hasWord ? "Remove from frame" : "Add to frame"}
  onPress={() => {
    
    hasWord ? handleRemoveFromFrame() : handleAddToWordFrame();
  }}/> : <></>
}
  return (
    <>
      <View style={styles.container}>
        {audio ? (
          <Button title={word.name} onPress={playSound} />
        ) : (
          <TextToSpeech key={word.name} word={word} />
        )}
        
        {/* {hasArray ? <Button
        title={hasWord ? "Remove from frame" : "Add to frame"}
        onPress={() => {
          
          hasWord ? handleRemoveFromFrame() : handleAddToWordFrame();
        }}/> : <></>} */}
        {handleEditButtons()}
        {/* {hasWord ? (
          <Button
            title="Remove from frame"
            onPress={() => {
              handleRemoveFromFrame();
              console.log("removed from frame");
              hasWord = false
            }}
          />
        ) : (
          <Button
            title="Add to frame"
            onPress={() => {
              handleAddToWordFrame();
              hasWord = true
            }}
          />
        )} */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 5,
    width: 100,
  },
  button: {
    flex: 1,
    marginVertical: 8,
    width: 30,
    height: 30,
    backgroundColor: "red"
  },
  blue: {},
  red: {
    backgroundColor: "red",
  }
});
