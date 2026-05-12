export default function SetForm(setFunction, fieldName, value) {
    setFunction(prev => ({
        ...prev,
        [fieldName]: value
    }))
}