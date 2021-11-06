type CarouselState = {
  newImages: File[]
  imagesIdsToDelete: string[]
}

type State = CarouselState;

export const initialState: State = {
  newImages: [],
  imagesIdsToDelete: []
}

export type Actions = 
  | { type: "set-images-editor-data", payload: CarouselState };

export function reducer(state: State, action: Actions) {
  switch(action.type) {
    case "set-images-editor-data":
      return { ...state, ...action.payload }
    default:
      break;
  }
}
