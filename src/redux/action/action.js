export const addList = (text) => {
    return {
        type: 'ADD_LIST',
        payload: text
    }
}

export const getList = (data) => {
    return {
        type: 'GET_LIST',
        payload: data
    }
}

export const removeList = (id) => {
    return {
      type: "REMOVE_LIST",
      payload: id,
    };
  };