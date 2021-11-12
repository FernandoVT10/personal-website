type CarouselState = {
  newImages: File[]
  imagesIdsToDelete: string[]
}

type TechnologiesState = {
  technologies: string[]
}

type State = CarouselState & TechnologiesState;

export const initialState: State = {
  newImages: [],
  imagesIdsToDelete: [],
  technologies: []
}

export type Actions = 
  | { type: "set-images-editor-data", payload: CarouselState }
  | { type: "set-input-value", payload: { value: string, name: string } }
  | { type: "set-technologies", payload: TechnologiesState }

export function reducer(state: State, action: Actions) {
  switch(action.type) {
    case "set-images-editor-data":
      return { ...state, ...action.payload }
    case "set-input-value":
      const { value, name } = action.payload;
      return { ...state, [name]: value }
    case "set-technologies":
      const { technologies } = action.payload;
      return { ...state, technologies }
    default:
      break;
  }
}
