import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    // <nav>
    //   <ul>
    //     <li>
    //       <Link to="/Generate" >Generate</Link>
    //     </li>
    //   </ul>
    // </nav>
//     <div>
//       <h1 style={{color:'white'}}>Welcome to Decentralized Storage Protocol</h1>
//  <nav style={{ display: 'flex', justifyContent: 'center', fontSize: '1.2em' }}>
//     <ul>
//       <li>
//         <button style={{backgroundColor: 'white', fontSize: '24px', borderRadius: '10px'}}>
//         <Link to="/Generate" style={{color: 'black', textDecoration: 'none'}}>Generate</Link>
//           </button>
        
//       </li>
//     </ul>
//   </nav>
//     </div>
<div style={{marginTop: '0px'}}>
  <h1 style={{color:'white',textAlign:'center'}}>Welcome to Decentralized Storage Protocol</h1>
  <nav style={{display: 'flex', justifyContent: 'center', fontSize: '1.2em'}}>
    <ul>
      <li>
        <button style={{backgroundColor: '#4d8c57', fontSize: '24px', borderRadius: '10px'}}>
          <Link to="/Generate" style={{color: 'white', textDecoration: 'none'}}>Generate</Link>
        </button>
      </li>
    </ul>
  </nav>
</div>
   
  );
}
