import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeStorageData = async (key:string, value:any) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    console.log("async storage store data ", key, " error", e)
  }
}

export const getStorageData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {
      console.log("async storage get data ", key, " error", e)
  }
}