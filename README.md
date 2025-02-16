# Warehouse

Une application mobile moderne et intuitive pour une gestion efficace des stocks d'entrepôt, comprenant des fonctionnalités de lecture de codes-barres et de suivi des stocks en temps réel.

## 🎯 Aperçu du Projet

Cette application vise à moderniser et simplifier la gestion des stocks pour les magasins de détail en fournissant aux magasiniers une interface mobile intuitive. L'application optimise la gestion des inventaires grâce à la lecture de codes-barres et aux options de saisie manuelle tout en maintenant des niveaux de stock précis en temps réel.

## ✨ Fonctionnalités Principales

### Authentification
- Accès sécurisé via des codes secrets personnels

### Gestion des Produits
- Scanner de codes-barres intégré utilisant expo-barcode-scanner
- Option de saisie manuelle des codes-barres
- Mises à jour des stocks en temps réel
- Affichage des informations produits (nom, type, prix, quantité)

### Vue d'Ensemble des Stocks
- Liste détaillée des produits comprenant :
  - Détails des produits (nom, type, prix)
  - État et disponibilité des stocks
  - Informations sur l'éditeur
  - Indicateurs visuels des niveaux de stock
- Actions de gestion des stocks (réapprovisionnement, retrait d'unités)

### Fonctionnalités Avancées
- Options puissantes de recherche et de filtrage
- Capacités de tri dynamique
- Tableau de bord statistique complet
- Fonctionnalité d'export de rapports PDF

## 🛠 Stack Technique

- **Frontend** : React Native avec Expo
- **Backend** : JSON Server
- **Dépendances Principales** :
  - expo-router : Routage de l'application
  - expo-camera : Lecture de codes-barres
  - react-native-reanimated : Animations fluides
  - axios : Communication API
  - Divers modules Expo pour des fonctionnalités améliorées

## 📋 Prérequis

- Node.js (dernière version LTS)
- Gestionnaire de paquets npm ou yarn
- Expo CLI
- JSON Server (pour le backend)

## 🚀 Démarrage

1. **Cloner le dépôt**
```bash
git clone https://github.com/Mohamed072005/Warehouse.git
cd Warehouse
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer le serveur backend**
```bash
npm i -g json-server
cd Warehouse
cd databse
json-server --watch db.json --port 5000
```

4. **Démarrer le serveur de développement Expo**
```bash
npm start
```

## 📱 Scripts Disponibles

- `npm start` : Lancer le serveur de développement Expo
- `npm run android` : Démarrer l'application Android
- `npm run ios` : Démarrer l'application iOS
- `npm run web` : Démarrer la version web
- `npm test` : Exécuter les tests
- `npm run lint` : Exécuter le linting
- `npm run reset-project` : Réinitialiser le projet à son état initial

## 📊 Fonctionnalités du Tableau de Bord

L'application inclut un tableau de bord complet affichant :
- Nombre total de produits
- Nombre total de villes
- Produits en rupture de stock
- Valeur totale des stocks
- Mouvements de stock récents

## 🔍 Capacités de Recherche et de Filtrage

Les utilisateurs peuvent :
- Rechercher par nom de produit, type, prix ou fournisseur
- Trier les produits par :
  - Prix (croissant/décroissant)
  - Nom (alphabétique)
  - Quantité
- Filtrer les produits selon l'état du stock

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request