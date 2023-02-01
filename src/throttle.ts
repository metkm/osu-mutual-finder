export const throttle = (
  callback: (...params: any) => void,
  limit: number
) => {
  let wait = false;
  return (...args: any) => {
    if (wait) return;

    wait = true;
    setTimeout(() => {
      wait = false;
    }, limit)

    callback(...args)
  }
}
