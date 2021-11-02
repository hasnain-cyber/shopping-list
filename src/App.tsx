import {Route, Switch} from "react-router-dom";
import MainPage from "./pages/MainPage";
import AddShop from "./pages/AddShop/AddShop";
import {useState} from "react";

function App() {

    // this state determines whether if the add new shop page should add new shop or modify
    // existing one.
    const [modifyName, setModifyName] = useState('')

    return (
        <Switch>
            <Route exact path={'/'} component={() => <MainPage setModifyName={setModifyName}/>}/>
            <Route exact path={'/addShop'}
                   component={() => <AddShop modifyName={modifyName} setModifyName={setModifyName}/>}/>
        </Switch>
    );
}

export default App;
