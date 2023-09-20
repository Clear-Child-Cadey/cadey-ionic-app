import React, { useContext, useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
} from '@ionic/react';
// CSS
import './Articles.css';
// Components
import CategoriesList from '../../components/Articles/CategoriesList';
import ArticlesList from '../../components/Articles/ArticlesList';
import ArticleDetail from '../../components/Articles/ArticleDetail';
// Interfaces
import { WP_Category } from '../../api/WordPress/GetCategories';
import { WP_Article } from '../../api/WordPress/GetArticles';

const ArticlesPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const [selectedArticle, setSelectedArticle] = useState<number>(0);
    const [showArticlesList, setShowArticlesList] = useState(false);
    const [showArticleDetail, setShowArticleDetail] = useState(false);

    // Handler for when the user selects a category
    const handleCategorySelect = (category: WP_Category) => {
        document.title = category.name + " Articles";
        setSelectedCategory(category.id);
        setShowArticlesList(true);
        console.log("Selected Category: ", category);
    };
    
    // Handler for when the user selects an article
    const handleArticleSelect = (article: WP_Article) => {
        document.title = article.title.rendered + " | Article Detail";
        setSelectedArticle(article.id);
        setShowArticleDetail(true);
        console.log("Selected Article: ", article);
    };

    // Handler for when the user starts over
    const handleRestart = () => {
        document.title = "Articles";
        setShowArticlesList(false);
        setShowArticleDetail(false);
    };

    // Set the page title on load
    useEffect(() => {
        document.title = 'Articles';
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Articles</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Articles</IonTitle>
                    </IonToolbar>
                </IonHeader>
                {/* Call the renderComponent function to render the correct component */}
                {renderComponent()}
            </IonContent>
        </IonPage>
    );
    // Return the correct component depending on the state
    function renderComponent() {
        if (showArticleDetail) {
        return (
            <ArticleDetail articleId={selectedArticle} onRestart={handleRestart} />
        );
        } else 
        if (showArticlesList && selectedCategory !== 0) {
        return (
            <ArticlesList categoryId={selectedCategory} onSelectArticle={handleArticleSelect} />
        );
        } else {
            return <CategoriesList onSelectCategory={handleCategorySelect} />
        };
    }
};

export default ArticlesPage;