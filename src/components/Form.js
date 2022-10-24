const Form = ({search, error ,handleSubmit, handleChange, toggleDark}) => {
    return (  
        <header className="mb-32">
            <h2 className="title-col ta-center mb-20" onClick={toggleDark}>NB Weather</h2>
            <form onSubmit={handleSubmit} className="ta-center">
                <label htmlFor="search">Enter a location for weather information</label>
                <input type="text" name="search" value={search} onChange={handleChange} />
                {error.show && <p className="error">{error.msg}</p>}
            </form>
        </header>
    );
}
 
export default Form;