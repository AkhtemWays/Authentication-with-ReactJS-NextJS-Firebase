export default function phoneValidation(phone) {
  return /[0-9]+/.test(Number.parseInt(phone));
}
