import useQuizesStore, { Item } from "@/store/quizesStore"
import { Link, useLocalSearchParams, useNavigation } from "expo-router"
import { useEffect, useState } from "react"
import { TouchableOpacity, StyleSheet, View, TextInput } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { ThemedText } from "@/components/ThemedText"
import * as DocumentPicker from 'expo-document-picker'
import { FlashList } from "@shopify/flash-list"


const Quizes = () => {
    const { findItem, addQuizes, removeQuizes, changeSolveState } = useQuizesStore()
    const { id } = useLocalSearchParams<{ id: string }>()
    const [titleInput, setTitleInput] = useState('')
    const [jsonData, setJsonData] = useState<any>(null)
    const [stateChanged, setStateChanged] = useState(false)
    const [item, setItem] = useState<Item>()
    const navigation = useNavigation()

    const onAddPressed = () => {
      if(titleInput == '' || jsonData == null) return
      addQuizes(parseInt(id!), { title: titleInput, questions: jsonData, solved: false, answers: {}})
      setTitleInput('')
      setJsonData(null)
    }

    const onDeletePressed = (quizeIndex: number) => {
        removeQuizes(parseInt(id!), quizeIndex)
    }

    const pickDocument = async () => {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json'
      })
      
      if (!result.canceled && result.assets !== null) {
        const fileUri = result.assets[0].uri
        const fileContent = await fetch(fileUri).then(res => res.text());
        try {
          const parsedData = JSON.parse(fileContent)
          setJsonData(parsedData);
        } catch (error) {
          console.error('Error parsing JSON:', error)
        }
      }
    }

    const resetButtonChanged = (itemIndex:number , quizeIndex:number) => {
      changeSolveState(itemIndex, quizeIndex, false)
      setItem(findItem(itemIndex))
      setStateChanged(prev => !prev)
    }

    useEffect(() => {
        navigation.setOptions({ title: id ? findItem(parseInt(id!))?.title : "Testler"})
    }, [navigation])

    useEffect(() => {
        setItem(findItem(parseInt(id!)))
    },[item])

    return(
      <>
        <View style={styles.addView}>
          <TextInput
              style={styles.input}
              onChangeText={setTitleInput}
              value={titleInput}
              />
          <TouchableOpacity
              onPress={pickDocument}
              style={styles.addButton}
              >
              <MaterialIcons name="create-new-folder" size={24} color="black" />
              <ThemedText style={{ paddingLeft: 10}}>Dosya Sec</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={onAddPressed}
              style={styles.addButton}
              >
              <MaterialIcons name="library-add" size={24} color="black" />
              <ThemedText style={{ paddingLeft: 10}}>Ekle</ThemedText>
          </TouchableOpacity>
        </View>
        {item && <FlashList
          data={item?.quizes}
          extraData={stateChanged}
          renderItem={({ item, index }) => 
            <View style={styles.listButton}>
              {item.solved ? 
              <Link href={{ pathname:`quizes/answersPage`, params:{itemIndex: parseInt(id!), quizeIndex: index}}} asChild>
                <TouchableOpacity
                    onPress={() => console.log(`clicked ${index}`)}
                    style={{flex: 4, padding: 10}}
                    >
                    <ThemedText>{item?.title}</ThemedText>
                </TouchableOpacity>
              </Link>
              :<Link href={{ pathname:`quizes/questionsPage`, params:{itemIndex: parseInt(id!), quizeIndex: index}}} asChild>
                <TouchableOpacity
                    onPress={() => console.log(`clicked ${index}`)}
                    style={{flex: 4, padding: 10}}
                    >
                    <ThemedText>{item?.title}</ThemedText>
                </TouchableOpacity>
              </Link>}
              {item.solved && <TouchableOpacity 
                onPress={() => resetButtonChanged(parseInt(id!), index)}
                style={{ padding: 10, borderLeftWidth: 1 }}>
                <MaterialIcons name="refresh" size={30} color="blue" />
              </TouchableOpacity>}
              <TouchableOpacity 
                onPress={() => onDeletePressed(index)}
                style={{ padding: 10, borderLeftWidth: 1 }}>
                <MaterialIcons name="delete" size={30} color="red" />
              </TouchableOpacity>
            </View>}
          estimatedItemSize={200}
        />}
      </>
    )
}

const styles = StyleSheet.create({
    addButton:{
      alignItems: "center",
      justifyContent: "center",
      margin: 5,
      paddingVertical: 10,
      flexDirection: "row",
    },
    listButton:{
      flexDirection: "row",
      alignItems: "center",
      margin: 5,
      flex: 5,
      borderWidth: 1,
      borderColor: "black"
    },
    addView:{
      flexDirection: "row",
      borderWidth: 1,
      borderColor: "black",
      margin: 5
    },
    modalContent: {
      height: '25%',
      width: '100%',
      backgroundColor: '#25292e',
      borderTopRightRadius: 18,
      borderTopLeftRadius: 18,
      position: 'absolute',
      bottom: 0,
    },
    titleContainer: {
      height: '16%',
      backgroundColor: '#464C55',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      color: '#fff',
      fontSize: 16,
    },
    input: {
      flex:1,
      paddingLeft: 15,
    },
})

export default Quizes 