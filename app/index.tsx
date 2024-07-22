import { ThemedText } from "@/components/ThemedText"
import { TouchableOpacity, Text, StyleSheet, View, TextInput } from "react-native"
import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import useQuizesStore from "@/store/quizesStore";
import { getStorageData, storeStorageData } from "@/store/AsyncStorageFunc";
import { Link } from "expo-router";


export default function MainScreen () {
    const {items, addItem, removeItem, addAllItems} = useQuizesStore()
    const [titleInput, setTitleInput] = useState('')

    const onAddPressed = () => {
      if(titleInput == '') return
      addItem({
        title: titleInput,
        quizes: []
      })
      setTitleInput('')
    }

    const onDeletePressed = (index:any) => {
      removeItem(index)
    } 

    const syncAddedItems = async () => {
      await storeStorageData("listItems", items)
    }

    const syncWithStorage = async () => {
      const listItems = await getStorageData("listItems")
      if(listItems){
        addAllItems(listItems)
      }
    }

    useEffect(() => {
      syncWithStorage()
    }, [])

    useEffect(() => {
      syncAddedItems()
    }, [items])

    return (
      <>
        <View style={styles.addView}>
            <TextInput
                style={styles.input}
                onChangeText={setTitleInput}
                value={titleInput}
                />
            <TouchableOpacity
                onPress={onAddPressed}
                style={styles.addButton}
                >
                <MaterialIcons name="library-add" size={24} color="black" />
                <ThemedText style={{ paddingLeft: 10}}>Ekle</ThemedText>
            </TouchableOpacity>
        </View>
        <FlashList
          data={items}
          renderItem={({ item, index }) => 
            <View style={styles.listButton}>
              <Link href={{ pathname:`quizes/${index}`}} asChild>
                <TouchableOpacity
                    style={{flex: 4, padding: 10}}
                    >
                    <ThemedText>{item?.title}</ThemedText>
                </TouchableOpacity>
              </Link>
              <TouchableOpacity 
                onPress={() => onDeletePressed(index)}
                style={{ padding: 10, borderLeftWidth: 1 }}>
                <MaterialIcons name="delete" size={30} color="red" />
              </TouchableOpacity>
            </View>}
          estimatedItemSize={200}
        />
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
