import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  votes: [],
  currentVote: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
}

const voteSlice = createSlice({
  name: 'votes',
  initialState,
  reducers: {
    fetchVotesStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchVotesSuccess: (state, action) => {
      state.isLoading = false
      state.votes = action.payload.data
      state.pagination = action.payload.pagination
    },
    fetchVotesFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    setVotePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    setCurrentVote: (state, action) => {
      state.currentVote = action.payload
    },
    addVote: (state, action) => {
      state.votes.unshift(action.payload)
    },
    updateVote: (state, action) => {
      const index = state.votes.findIndex((v) => v.id === action.payload.id)
      if (index !== -1) {
        state.votes[index] = action.payload
      }
    },
    deleteVote: (state, action) => {
      state.votes = state.votes.filter((v) => v.id !== action.payload)
    },
  },
})

export const {
  fetchVotesStart,
  fetchVotesSuccess,
  fetchVotesFailure,
  setVotePagination,
  setCurrentVote,
  addVote,
  updateVote,
  deleteVote,
} = voteSlice.actions

export default voteSlice.reducer
