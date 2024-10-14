import React from 'react';
import { Oval} from 'react-loader-spinner'; 

const Spinner = ({ loading = true }) => {
  if (!loading) return null; 

  return (
    <div className="flex justify-center items-center h-screen">
        <Oval
            visible={true}
            height="24"
            width="24"
            color="#0000FF"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
            strokeWidth={5}
            secondaryColor='#ced4da'
        />
    </div>
  );
};

export default Spinner;
