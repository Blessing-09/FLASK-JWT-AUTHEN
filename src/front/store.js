export const initialStore=()=>{
  return{
    message: null,
    signup: [], 
    login: [],
    profile: null
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'signup':
      return {
        ...store,
        signup: [...store.signup, action.payload]
      };
      case "login":
        return {
          ...store,
          login: [...store.login, action.payload]
        };
         case "profile":
        return {
          ...store,
          profile: action.payload
        };
    default:
      throw Error('Unknown action.');
  }    
}
