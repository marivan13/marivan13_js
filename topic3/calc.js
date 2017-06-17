function calcDivide (firstoperand,secondoperand)
{
  return firstoperand/secondoperand;
}

function calcMultiply(firstoperand,secondoperand)
{
  return firstoperand*secondoperand;
}

function calcAdd(firstoperand,secondoperand)
{
  return firstoperand+secondoperand;
}

function calcSubtract(firstoperand,secondoperand)
{
  return firstoperand-secondoperand;
}

function parseStringNumOPeratorsToArray(inputStr)
{
  return inputStr.split(/(\+|\*|\-|\/)/);
}

function calcFromArray(calcArr)
{
  var currentOperation;
  var newCalcArr =[];
  var operatorsArrayOfObjects=[
    {'/': calcDivide},
    {'*': calcMultiply},
    {'+': calcAdd},
    {'-': calcSubtract}
  ];
  console.dir(operatorsArrayOfObjects);
  operatorsArrayOfObjects.forEach(function(operator)
  {
    calcArr.forEach(function(elem)
    {
      if (operator[elem])
      {
        currentOperation = operator[elem];
      }
      else if (currentOperation) {
        newCalcArr[newCalcArr.length-1] = currentOperation(+newCalcArr[newCalcArr.length-1], +elem);
        currentOperation = null;
      }
      else {
        newCalcArr.push(elem);
      }
      console.log(newCalcArr);
    });
    calcArr = newCalcArr;
    newCalcArr = [];
  });
  return calcArr;
}
