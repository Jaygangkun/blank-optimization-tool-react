import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

import React from 'react'
import { CContainer } from '@coreui/react'
import AppSidebar from './Components/AppSidebar';
import AppHeader from './Components/AppHeader';
import WorkStage from './Components/WorkStage';

function App() {
  return (
    <div className="App">
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <CContainer>
            <WorkStage />
          </CContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
