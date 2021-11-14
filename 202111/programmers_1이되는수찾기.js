function solution(n) {
  const minusNum = n - 1;
  for (let i = 2; i < minusNum; i += 1) {
    if (minusNum % i === 0) {
      return i;
    }
  }
  return minusNum;
}
