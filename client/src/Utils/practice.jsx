
// let retirementAge = 65;


export default function Practice() { 
  
  const arr = [1,2,3,4,5,6,3,4,5,6,6,4,4,4,4];

  const freq = arr.reduce((acc,n) => {

    acc[n] = (acc[n] || 0) + 1;

    return acc;
  },{})

  console.log(freq);


  return (
    <></>
  );


}