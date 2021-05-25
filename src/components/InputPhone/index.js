export function InputPhone({ onChange, ...rest }) {

  function handlePhoneValidation(event) {
    let { value } = event.target

    value = value.replace(/\D/g, '')
    value = value.replace(/(\d{2})/, '($1) ')
    const isMobilePhone = /^[(][0-9][0-9][)][\s][9]/.test(value)

    if (!/[0-9]/.test(event.key)) {
      event.preventDefault()
    }

    if (isMobilePhone) {
      event.currentTarget.maxLength = 15
      value = value.replace(/\D/g, '')
      value = value.replace(/(\d{2})(\d{1})/, '($1) $2')
      value = value.replace(/(\d{5})/, '$1-')
      value = value.replace(/(\d{4})/, '$1')
    } else {
      event.currentTarget.maxLength = 14
      value = value.replace(/(\d{4})/, '$1-')
      value = value.replace(/(\d{4})/, '$1')
    }

    event.currentTarget.value = value
  }

  return (
    <input {...rest} type="tel" onKeyPress={handlePhoneValidation} />
  );
}