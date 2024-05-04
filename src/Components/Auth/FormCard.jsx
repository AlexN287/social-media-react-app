import React from "react";
import '../../Styles/Components/Auth/FormCard.css';

const FormCard = ({ children, title }) => (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="box">
              {title && <h1 className="card-title">{title}</h1>}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  export default FormCard;
  