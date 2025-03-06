// Food.js
class Food {
    constructor(data) {
        this.id = data["식품코드"]; // Unique identifier
        this.name = data["식품명"]; // Name of the food
        this.calories = parseFloat(data["에너지(kcal)"]) || 0; // Calories in kcal
        this.protein = parseFloat(data["단백질(g)"]) || 0; // Protein in grams
        this.carbs = parseFloat(data["탄수화물(g)"]) || 0; // Carbohydrates in grams
        this.fat = parseFloat(data["지방(g)"]) || 0; // Fat in grams
        this.sodium = parseFloat(data["나트륨(mg)"]) || 0; // Sodium in milligrams
        this.sugar = parseFloat(data["당류(g)"]) || 0; // Sugar in grams
        this.fiber = parseFloat(data["식이섬유(g)"]) || 0; // Dietary fiber in grams
        this.weight = data["식품중량"] || "N/A"; // Weight (default: "N/A" if empty)
        this.source = data["출처명"] || "Unknown"; // Source (default: "Unknown")
        // Add more fields as necessary based on how you plan to use the data
    }
}
export default Food;