import { ThemedText } from '@/components/ThemedText';
import useQuizesStore, { Quizes } from '@/store/quizesStore';
import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import PagerView from 'react-native-pager-view';

const QuestionsPage = () => {
  const { findQuestions, changeSolveState, changeAnswer } = useQuizesStore()
  const { itemIndex, quizeIndex } = useLocalSearchParams<{ itemIndex: string, quizeIndex: string }>()
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number }>({})
  const [questions, setQuestions] = useState<Quizes>()
  const [show, setShow] = useState(false)
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

  const selectOption = (questionIndex: number, optionIndex: number) => {
    setSelectedOptions({ ...selectedOptions, [questionIndex]: optionIndex })
  }

   useEffect(() => {
    if (itemIndex && quizeIndex) {
      const itemIdx = parseInt(itemIndex)
      const quizeIdx = parseInt(quizeIndex)
      const questions = findQuestions(itemIdx, quizeIdx)

      if (questions) {
        navigation.setOptions({ title: questions.title })
        setQuestions(questions)
      } else {
        console.error(`Questions not found for itemIndex: ${itemIdx}, quizeIndex: ${quizeIdx}`)
      }
    } else {
      console.error(`Invalid itemIndex or quizeIndex: itemIndex: ${itemIndex}, quizeIndex: ${quizeIndex}`)
    }
  }, [navigation, itemIndex, quizeIndex])

  useEffect(() => {
    setQuestions(findQuestions(parseInt(itemIndex!), parseInt(quizeIndex!)))
  }, [])

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
              extraData={selectOption}
              renderItem={({ item, index }) =>
                <TouchableOpacity onPress={() => selectOption(questionIndex, index)}>
                  <View style={[
                    styles.listButton,
                    selectedOptions[questionIndex] === index ? { backgroundColor: "#c4c3c2" } : { borderColor: "black" }
                  ]}>
                    <Text key={index} style={styles.optionText}>{item}</Text>
                  </View>
                </TouchableOpacity>}
              estimatedItemSize={20}
            />
            <TouchableOpacity
              style={{ borderWidth: 1, padding: 5, alignItems: "center", margin: 5}}
              onPress={() => setShow(prev => !prev)}>
              <ThemedText>Cevabı Göster</ThemedText>
            </TouchableOpacity>
            {show && <Text style={styles.questionText}>{question.longAnswer}</Text>}
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
            if (currentPage === questions?.questions.length - 1) {
              if (itemIndex && quizeIndex) {
                const itemIdx = parseInt(itemIndex)
                const quizeIdx = parseInt(quizeIndex)
                changeSolveState(itemIdx, quizeIdx, true)
                changeAnswer(itemIdx, quizeIdx, selectedOptions)
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default QuestionsPage
