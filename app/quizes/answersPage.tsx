import { ThemedText } from "@/components/ThemedText"
import useQuizesStore, { Question, Quizes } from '@/store/quizesStore'
import { MaterialIcons } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import PagerView from 'react-native-pager-view'

const AnswersPage = () => {
    const { findQuestions, changeSolveState, changeAnswer } = useQuizesStore()
    const { itemIndex, quizeIndex } = useLocalSearchParams<{ itemIndex: string, quizeIndex: string }>()
    const [currentPage, setCurrentPage] = useState(0)
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number }>({})
    const [questions, setQuestions] = useState<Quizes>()
    const pagerRef = useRef<PagerView>(null)
    const navigation = useNavigation()
  
    const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber)
    }
  
    const goToPage = (pageNumber: number) => {
      if (pagerRef.current) {
        pagerRef.current.setPage(pageNumber)
      }
      setCurrentPage(pageNumber)
    }
  
    /* const selectOption = (questionIndex: number, optionIndex: number) => {
      setSelectedOptions({ ...selectedOptions, [questionIndex]: optionIndex })
    } */
  
    useEffect(() => {
      if (itemIndex && quizeIndex) {
        const itemIdx = parseInt(itemIndex)
        const quizeIdx = parseInt(quizeIndex)
        const fetchedQuestions = findQuestions(itemIdx, quizeIdx)
  
        if (fetchedQuestions) {
          navigation.setOptions({ title: fetchedQuestions.title })

          const deepCopiedQuestions:Quizes = JSON.parse(JSON.stringify(fetchedQuestions))

          deepCopiedQuestions.questions = deepCopiedQuestions.questions.filter(
            (question, questionIndex) => ((deepCopiedQuestions.answers[questionIndex] && question.answer != deepCopiedQuestions.answers[questionIndex]) || deepCopiedQuestions.answers[questionIndex] == undefined)
          )
          setQuestions(deepCopiedQuestions)
        } else {
          console.error(`Questions not found for itemIndex: ${itemIdx}, quizeIndex: ${quizeIdx}`)
        }
      } else {
        console.error(`Invalid itemIndex or quizeIndex: itemIndex: ${itemIndex}, quizeIndex: ${quizeIndex}`)
      }
    }, [navigation, itemIndex, quizeIndex])


    if (!questions) {
      return (
        <View style={styles.massageContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      )
    }

    if (questions.questions.length === 0) {
      return (
        <View style={styles.massageContainer}>
          <ThemedText style={styles.questionText}>Tebrikler Hepsi Doğru</ThemedText>
        </View>
      )
    }
    
    return (
      <View style={styles.container}>
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={(e) => handlePageChange(e.nativeEvent.position)}
        >
          {questions?.questions.map((question, questionIndex) => (
            <ScrollView key={questionIndex} contentContainerStyle={styles.page}>
              <Text style={styles.questionText}>{currentPage + 1} - {question.question}</Text>
              <FlashList
                data={question.options}
                renderItem={({ item, index }) =>
                  <TouchableOpacity disabled={true}>
                    <View style={[
                      styles.listButton,
                      (questions.answers[questionIndex] && questions.answers[questionIndex] == index)  ? { backgroundColor: "#c4c3c2" } : { borderColor: "black" },
                      question.answer === index  ? { backgroundColor: "green" } : { borderColor: "black" }
                    ]}>
                      <Text key={index} style={styles.optionText}>{item}</Text>
                    </View>
                  </TouchableOpacity>}
                estimatedItemSize={20}
              />
              <Text style={styles.questionText}>{question.longAnswer}</Text>
            </ScrollView>
          ))}
        </PagerView>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => {
              if (currentPage > 0) {
                goToPage(currentPage - 1)
              }
            }}
            disabled={currentPage === 0}
            style={currentPage === 0 ? { padding: 5, borderWidth: 1.5, borderColor: "grey" } : { padding: 5, borderWidth: 1.5 }}>
            <MaterialIcons name="arrow-back-ios-new" size={30} color={currentPage === 0 ? "grey" : "black"} />
          </TouchableOpacity>
          <ThemedText>{currentPage + 1} / {questions?.questions.length}</ThemedText>
          {questions?.questions && <TouchableOpacity
            onPress={() => {
              if (currentPage === questions?.questions.length - 1){
                if (itemIndex) {
                  const itemIdx = parseInt(itemIndex)
                  router.back()
                  router.replace(`quizes/${itemIdx}`)
                }
              }
              if (currentPage < questions?.questions.length - 1) {
                goToPage(currentPage + 1)
              }
            }}
            style={currentPage === questions?.questions.length - 1 ? { padding: 5, borderWidth: 1.5, borderColor: "grey" } : { padding: 5, borderWidth: 1.5 }}>
            {currentPage === questions?.questions.length - 1 ? <ThemedText style={{ fontSize: 20 }}>Bitir</ThemedText> :
              <MaterialIcons name="arrow-forward-ios" size={30} color={currentPage === questions?.questions.length - 1 ? "grey" : "black"} />}
          </TouchableOpacity>}
        </View>
      </View>
    )
}

export default AnswersPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  massageContainer:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  page: {
    flexGrow: 1,
  },
  pagerView: {
    flex: 1,
  },
  questionText: {
    fontSize: 20,
    padding: 10
  },
  optionText: {
    fontSize: 18,
    padding: 10
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  listButton: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    borderWidth: 1,
  },
})