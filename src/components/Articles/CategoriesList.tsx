import React, { useEffect, useState } from 'react';
import { getCategories, WP_Category } from '../../api/WordPress/GetCategories';
import {
    IonList,
    IonItem,
    IonLabel,
    IonLoading,
    IonRow,
    IonCol,
    IonButton,
    IonGrid,
    IonText,
} from '@ionic/react';
// CSS
import './CategoriesList.css';

// Setup the interface
interface CategoriesListProps {
    onSelectCategory: (category: WP_Category) => void;
}

const CategoriesList: React.FC<CategoriesListProps> = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState<WP_Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch the categories from the API when the component is mounted
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Log a user fact and proceed to the next screen
    const handleOnClick = (category: WP_Category) => {
        // TODO: Log user fact
        onSelectCategory(category);
    }

    return (
        <div>
            <IonLoading isOpen={isLoading} message={'Loading Categories...'} />
            
            <IonGrid className="categories-wrapper">
                <IonRow>
                    <IonText className="subcopy">Select a category:</IonText>
                </IonRow>
                <IonRow>
                    {/* Iterate over the choices and create a button for each concern */}
                    {categories.map((category, index) => (
                        <IonCol size="6" key={index}>
                            {/* When a button is clicked, call the onNext function with the chosen concern */}
                            <IonButton
                            className="category"
                            color="light"
                            expand="block"
                            size="large"
                            onClick={() => handleOnClick(category)}                                                >
                            {category.name}
                            </IonButton>
                        </IonCol>
                    ))}
                </IonRow>
            </IonGrid>
        </div>
    );
};

export default CategoriesList;
