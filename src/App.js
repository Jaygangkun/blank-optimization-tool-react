import logo from './logo.svg';

import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

import React from 'react'
import { CHeader, CContainer, CHeaderBrand, CHeaderToggler, CCollapse, CHeaderNav, CNavItem, CNavLink, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider, CForm, CFormInput, CButton, CSidebar, CSidebarBrand, CSidebarNav, CNavTitle, CBadge, CNavGroup, CSidebarToggler, CImage, CCard, CCardBody, CCardTitle} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faSearchPlus, faSearchMinus, faHandPaper, faUndo, faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import AppSidebar from './Components/AppSidebar';
import AppHeader from './Components/AppHeader';
import WorkStage from './Components/WorkStage';

function App() {
  const [visible, setVisible] = React.useState(false)
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
