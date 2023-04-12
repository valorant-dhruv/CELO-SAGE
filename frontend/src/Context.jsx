import React, { createContext } from "react";

//What does the createContext means?
//It is a react function which creates a context so that we can have a global state which can be used inside 
//all of our react components 
let Context = createContext(null);

export default Context;
