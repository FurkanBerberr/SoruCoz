import {create} from 'zustand'

export type Question = {
  question: string
  options: string[]
  longAnswer: string
  answer: number
}

export type Quizes = {
  title: string
  solved: boolean
  questions: Question[]
  answers: { [key: number]: number }
}

export type Item = {
  title: string
  quizes: Quizes[]
}

type StoreState = {
  items: Item[]
  addItem: (item: Item) => void
  removeItem: (index: number) => void
  addAllItems: (items: Item[]) => void
  findItem: (index: number) => Item
  addQuizes: (itemIndex: number, quize: Quizes) => void
  removeQuizes: (itemIndex: number, quizeIndex:number) => void
  findQuestions: (itemIndex: number, quizeIndex: number) => Quizes | undefined
  changeSolveState: (itemIndex: number, quizeIndex:number, solveState: boolean) => void
  changeAnswer: (itemIndex: number, quizeIndex: number, answers: any) => void
}


const useQuizesStore = create<StoreState>((set, get) => ({
    items: [],
    addItem: (item: Item) => set((state) => ({
        items: [...state.items, item]
    })),
    removeItem: (index: number) => set((state) => ({
        items: state.items.filter((_, i) => i !== index)
    })),
    addAllItems: (items: Item[]) => set(() => ({
      items: items
    })),
    findItem: (index: number) => {
      const { items } = get()
      return items[index]
    },
    addQuizes: (itemIndex: number, quize: Quizes) => set((state) => {
    const newItems = [...state.items];
    if (itemIndex >= 0 && itemIndex < newItems.length) {
      newItems[itemIndex].quizes = [...newItems[itemIndex].quizes, quize];
    }
    return { items: newItems };
  }),
  removeQuizes: (itemIndex: number, quizeIndex: number) => set((state) => {
    const newItems = [...state.items];
    if (itemIndex >= 0 && itemIndex < newItems.length) {
      newItems[itemIndex].quizes = newItems[itemIndex].quizes.filter((_, i) => i !== quizeIndex);
    }
    return { items: newItems };
  }),
  findQuestions: (itemIndex: number, quizeIndex: number) => {
    const { items } = get();
    if (itemIndex >= 0 && itemIndex < items.length) {
      const item = items[itemIndex];
      if (quizeIndex >= 0 && quizeIndex < item.quizes.length) {
        return item.quizes[quizeIndex];
      }
    }
    return undefined;
  },
  changeSolveState: (itemIndex: number, quizeIndex: number, solveState: boolean) => set((state) => {
    const newItems = [...state.items];
    if (itemIndex >= 0 && itemIndex < newItems.length) {
      const item = newItems[itemIndex];
      if (quizeIndex >= 0 && quizeIndex < item.quizes.length) {
        item.quizes[quizeIndex].solved = solveState;
      }
    }
    return { items: newItems };
  }),
  changeAnswer: (itemIndex: number, quizeIndex: number, answers: any) => set((state) => {
    const newItems = [...state.items]
    if (itemIndex >= 0 && itemIndex < newItems.length) {
      const item = newItems[itemIndex]
      if (quizeIndex >= 0 && quizeIndex < item.quizes.length) {
        item.quizes[quizeIndex].answers = answers
      }
    }
    return { items: newItems }
  })
}))


export default useQuizesStore;