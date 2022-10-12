import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Icon from 'react-native-vector-icons/Entypo';  // https://github.com/oblador/react-native-vector-icons  npm install --save react-native-vector-icons
import Icon2 from 'react-native-vector-icons/FontAwesome5'; 

export default function App() {
  const blankBoard = {1: ' ' , 2: ' ' , 3: ' ' , 4: ' ' , 5: ' ' , 6: ' ' , 7: ' ' , 8: ' ' , 9: ' ' };
  const [board, setBoard] = useState(blankBoard);
  const [turn, setTurn] = useState(-1);
  const [endText, setEndText] = useState("");
  const [cpu, setCpu] = useState(false);
  const [cpuFirst, setCpuFirst] = useState();

  const [menuModal, setMenuModal] = useState(true);
  const [endModal, setEndModal] = useState(false);

  const handleMove = (index) => {
    let tempBoard = JSON.parse(JSON.stringify(board));
    if(tempBoard[index] == ' '){
      if(turn % 2 == 0){
        tempBoard[index] = 'O';
      }else{
        tempBoard[index] = 'X';
      }
      setBoard(tempBoard); 
    }
  }

  const checkWin = () => {
    let row1 = board[1] == board[2] && board[2] == board[3] && board[1] != ' '; 
    let row2 = board[4] == board[5] && board[5] == board[6] && board[4] != ' '; 
    let row3 = board[7] == board[8] && board[8] == board[9] && board[7] != ' '; 
    let down1 = board[1] == board[4] && board[4] == board[7] && board[1] != ' '; 
    let down2 = board[2] == board[5] && board[5] == board[8] && board[2] != ' '; 
    let down3 = board[3] == board[6] && board[6] == board[9] && board[3] != ' '; 
    let diag1 = board[1] == board[5] && board[5] == board[9] && board[1] != ' '; 
    let diag2 = board[3] == board[5] && board[5] == board[7] && board[3] != ' '; 

    if(row1 || row2 || row3 || down1 || down2 || down3 || diag1 || diag2){
      if(turn % 2 == 0){
        setEndText("O Won!");
      }else{
        setEndText("X Won!");
      }
      setEndModal(true);
    }else if(turn >= 8){
      setEndText("Tie Game");
      setEndModal(true);
    }else{
      setTurn(turn + 1);
    }
  }

  const renderRow = (start, end) => {
    let content = [];
    for(let index = start; index <= end; index++){
      if(board[index] == 'O'){
        content.push(
          <TouchableOpacity key={index} style={styles.boardButtons} onPress={() => {handleMove(index)}}>
             <Text><Icon style={[styles.boardIcon, {color: "#FFF"}]} name="circle"/></Text>
          </TouchableOpacity>
        );
      }else if(board[index] == 'X'){ 
        content.push(
          <TouchableOpacity style={styles.boardButtons} onPress={() => {handleMove(index)}}>
             <Text><Icon style={[styles.boardIcon, {color: "#FFF"}]} name="cross"/></Text>
          </TouchableOpacity>
        );
      }else {
        content.push(
          <TouchableOpacity style={styles.boardButtons} onPress={() => {handleMove(index)}}>
            <Text><Icon style={[styles.boardIcon, {color: "transparent"}]} name="dot-single"/></Text>
          </TouchableOpacity>
        );
      }
    }
    return content;
  }

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max) + 1;
  }

  const firstMove = () => {
    let num = getRandomInt(2) - 1;
    setCpuFirst(num);
    if(num == 1){
      cpuMove();
    }
  }

  const cpuMove = () => {
    let noHit = true;
    while (noHit){
      let tempBoard = JSON.parse(JSON.stringify(board));
      let cpuIndex = getRandomInt(9);
      if(tempBoard[cpuIndex] == ' '){
        noHit = false;
        if(turn % 2 == 0){
          tempBoard[cpuIndex] = 'O';
        }else{
          tempBoard[cpuIndex] = 'X';
        }
        setBoard(tempBoard);
      }
    }
  }

  useEffect(() => {
    checkWin();
  }, [board]);

  useEffect(() => {
    if((turn % 2) != cpuFirst && cpu){
      cpuMove();
    }
  }, [turn]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Game Menu Modal */}
      <Modal
        animationType="fade"
        statusBarTranslucent={true}
        transparent={true}
        visible={menuModal}
      >
        <View style={styles.container}>
          <TouchableOpacity style={styles.menuButton} onPress={() => {setMenuModal(false); setCpu(true); firstMove();}}>
            <Text style={[styles.whiteText, {fontSize: 25}]}><Icon2 name="user-alt" style={[styles.blueText, {fontSize: 30}]}/>  Singleplayer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => {setMenuModal(false);}}>
            <Text style={[styles.whiteText, {fontSize: 25}]}><Icon2 name="user-friends" style={[styles.blueText, {fontSize: 30}]}/>  Multiplayer</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.rows}>
        {
          renderRow(1, 3)
        }
      </View>
      <View style={styles.rows}>
        {
          renderRow(4, 6)
        }
      </View>
      <View style={styles.rows}>
        {
          renderRow(7, 9)
        }
      </View>

      {/* End Game Modal */}
      <Modal
        animationType="fade"
        statusBarTranslucent={true}
        transparent={true}
        visible={endModal}
        onRequestClose={() => {setMenuModal(true); setEndModal(false); setBoard(blankBoard); setTurn(-1); setCpu(false); setCpuFirst();}}
      >
        <View style={styles.modalBG}>
          <View style={styles.modalView}>
            <Text style={[styles.whiteText, {fontSize: 50}, {paddingBottom: 400}]}>{endText}</Text>
            <TouchableOpacity onPress={() => {setMenuModal(true); setEndModal(false); setBoard(blankBoard); setTurn(-1); setCpu(false); setCpuFirst();}}>
              <Text><Icon style={[styles.blueText, {fontSize: 60}]} name="cycle"/></Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    
  },
  modalBG: {
    flex: 1,
    alignItems: "center",
  },
  modalView: {
    paddingTop: 75,
    alignItems: "center",
  },
  menuButton: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: "#000",
    width: 300,
  },
  rows: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boardButtons: {
    padding: 16,
    alignItems: "center",
    borderWidth: 5,
    borderColor: '#FFF', 
  },
  boardIcon: {
    fontSize: 54,
  },
  blueText: {
    color: "#27e8a7",
  },
  whiteText: {
    color: "#FFF",
  },
  tinyLogo: {
    width: 200,
    height: 200,
    borderWidth: 9,
    borderColor: '#FFF', 
    borderRadius: 40, 
    marginBottom: 30,
  },
});
