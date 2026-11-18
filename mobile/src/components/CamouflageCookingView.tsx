import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { FALLBACK_RECIPES } from '../services/api';
import { useApp } from '../store/appStore';
import { colors } from '../theme/colors';
import {
  Search,
  Clock,
  Flame,
  Users,
  Star,
  ChefHat,
  X,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react-native';

const CATEGORIES = ['Tous', 'Tajines', 'Couscous', 'Pastillas', 'Soupes'];

export const CamouflageCookingView: React.FC = () => {
  const { unlockWithCode, disableCamouflage } = useApp();
  const [recipes] = useState(FALLBACK_RECIPES);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

  // Discreet Pin Access State
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  // Hidden interaction: tapping the Chef Hat icon 4 times within 2.5 seconds
  const handleSecretLogoTap = () => {
    const now = Date.now();
    if (now - lastTapTime < 2500) {
      const nextCount = tapCount + 1;
      setTapCount(nextCount);
      if (nextCount >= 4) {
        setTapCount(0);
        setShowSecretModal(true);
      }
    } else {
      setTapCount(1);
    }
    setLastTapTime(now);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() === '1234' || searchQuery.trim() === '2026' || searchQuery.toLowerCase().trim() === 'sanad') {
      setSearchQuery('');
      disableCamouflage();
      return;
    }
  };

  const handleVerifyPin = () => {
    if (unlockWithCode(pinInput.trim())) {
      setShowSecretModal(false);
      setPinInput('');
    } else {
      Alert.alert('Recette introuvable', 'Aucune recette associée à cette référence.');
      setPinInput('');
    }
  };

  const filteredRecipes = recipes.filter((r) => {
    const matchesCat = selectedCategory === 'Tous' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.titleAr.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Cooking Platform Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoRow}
          onPress={handleSecretLogoTap}
          activeOpacity={0.9}
        >
          <View style={styles.chefBadge}>
            <ChefHat size={22} color="#D97706" />
          </View>
          <View>
            <Text style={styles.logoTitle}>Chhiwat Lhadga</Text>
            <Text style={styles.logoSub}>شهيوات ووصفات المطبخ المغربي</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une recette, un ingrédient..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories Horizontal Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, active && styles.catPillActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.catPillText, active && styles.catPillTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Hero Banner */}
        <View style={styles.bannerCard}>
          <Text style={styles.bannerTag}>RECETTE DE SAISON</Text>
          <Text style={styles.bannerTitle}>Tajine de Veau aux Pruneaux Caramélisés</Text>
          <Text style={styles.bannerSub}>
            Le grand classique de la gastronomie fassie, subtil équilibre sucré-salé aux arômes de safran et cannelle.
          </Text>
        </View>

        {/* Recipe Grid / Stack */}
        <Text style={styles.sectionHeading}>RECETTES POPULAIRES ({filteredRecipes.length})</Text>

        <View style={styles.recipeStack}>
          {filteredRecipes.map((rec) => (
            <TouchableOpacity
              key={rec.id}
              style={styles.recipeCard}
              onPress={() => setSelectedRecipe(rec)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: rec.image }} style={styles.recipeImage} resizeMode="cover" />

              <View style={styles.recipeCardBody}>
                <View style={styles.ratingRow}>
                  <View style={styles.badgeCategory}>
                    <Text style={styles.badgeCategoryText}>{rec.category}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Star size={12} color="#D97706" fill="#D97706" />
                    <Text style={styles.ratingText}>{rec.rating}</Text>
                  </View>
                </View>

                <Text style={styles.recipeTitle}>{rec.title}</Text>
                <Text style={styles.recipeTitleAr}>{rec.titleAr}</Text>

                <View style={styles.recipeMetaRow}>
                  <View style={styles.metaItem}>
                    <Clock size={12} color="#6B7280" />
                    <Text style={styles.metaItemText}>{rec.prepTime}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Flame size={12} color="#6B7280" />
                    <Text style={styles.metaItemText}>{rec.calories}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Users size={12} color="#6B7280" />
                    <Text style={styles.metaItemText}>{rec.servings}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <Modal visible={true} animationType="slide">
          <SafeAreaView style={styles.detailSafe}>
            <View style={styles.detailHeader}>
              <TouchableOpacity
                style={styles.detailCloseBtn}
                onPress={() => setSelectedRecipe(null)}
              >
                <X size={20} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.detailHeaderTitle} numberOfLines={1}>
                {selectedRecipe.title}
              </Text>
              <View style={{ width: 36 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailScroll}>
              <Image source={{ uri: selectedRecipe.image }} style={styles.detailImage} />

              <View style={styles.detailBody}>
                <Text style={styles.detailTitle}>{selectedRecipe.title}</Text>
                <Text style={styles.detailTitleAr}>{selectedRecipe.titleAr}</Text>

                <View style={styles.detailMetaGrid}>
                  <View style={styles.metaBox}>
                    <Text style={styles.metaBoxLabel}>Préparation</Text>
                    <Text style={styles.metaBoxVal}>{selectedRecipe.prepTime}</Text>
                  </View>
                  <View style={styles.metaBox}>
                    <Text style={styles.metaBoxLabel}>Cuisson</Text>
                    <Text style={styles.metaBoxVal}>{selectedRecipe.cookTime}</Text>
                  </View>
                  <View style={styles.metaBox}>
                    <Text style={styles.metaBoxLabel}>Difficulté</Text>
                    <Text style={styles.metaBoxVal}>{selectedRecipe.difficulty}</Text>
                  </View>
                  <View style={styles.metaBox}>
                    <Text style={styles.metaBoxLabel}>Portions</Text>
                    <Text style={styles.metaBoxVal}>{selectedRecipe.servings}</Text>
                  </View>
                </View>

                {/* Ingredients */}
                <Text style={styles.detailSubHeading}>INGRÉDIENTS NÉCESSAIRES</Text>
                <View style={styles.ingredientsBox}>
                  {selectedRecipe.ingredients.map((ing: string, idx: number) => (
                    <View key={idx} style={styles.ingredientRow}>
                      <CheckCircle2 size={14} color="#D97706" />
                      <Text style={styles.ingredientText}>{ing}</Text>
                    </View>
                  ))}
                </View>

                {/* Instructions */}
                <Text style={styles.detailSubHeading}>ÉTAPES DE PRÉPARATION</Text>
                <View style={styles.instructionsStack}>
                  {selectedRecipe.instructions.map((step: string, idx: number) => (
                    <View key={idx} style={styles.stepCard}>
                      <View style={styles.stepNumBox}>
                        <Text style={styles.stepNumText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}

      {/* Secret Access Code Modal */}
      <Modal visible={showSecretModal} transparent animationType="fade">
        <View style={styles.secretOverlay}>
          <View style={styles.secretCard}>
            <View style={styles.secretTopRow}>
              <ShieldCheck size={24} color={colors.primary} />
              <TouchableOpacity onPress={() => setShowSecretModal(false)}>
                <X size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.secretTitle}>Espace Protégé SANAD</Text>
            <Text style={styles.secretSub}>
              Entrez votre code d'accès confidentiel pour ouvrir votre portail sécurisé.
            </Text>

            <TextInput
              style={styles.pinInput}
              placeholder="Code secret (ex: 1234)"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              secureTextEntry
              maxLength={8}
              value={pinInput}
              onChangeText={setPinInput}
              autoFocus
            />

            <View style={styles.secretActions}>
              <TouchableOpacity
                style={styles.secretCancelBtn}
                onPress={() => setShowSecretModal(false)}
              >
                <Text style={styles.secretCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secretConfirmBtn} onPress={handleVerifyPin}>
                <Text style={styles.secretConfirmText}>Déverrouiller</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chefBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: { fontSize: 18, fontWeight: '900', color: '#1F2937' },
  logoSub: { fontSize: 11, color: '#6B7280', marginTop: 1 },

  scrollContent: { paddingBottom: 40 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 46,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#1F2937' },

  categoryScroll: { paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  catPillActive: { backgroundColor: '#D97706', borderColor: '#D97706' },
  catPillText: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  catPillTextActive: { color: '#FFFFFF' },

  bannerCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  bannerTag: { fontSize: 10, fontWeight: '900', color: '#B45309', letterSpacing: 1 },
  bannerTitle: { fontSize: 17, fontWeight: '800', color: '#78350F', marginTop: 4, marginBottom: 6 },
  bannerSub: { fontSize: 12, color: '#92400E', lineHeight: 18 },

  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: '#6B7280',
    letterSpacing: 1,
    marginHorizontal: 20,
    marginBottom: 12,
  },

  recipeStack: { paddingHorizontal: 16, gap: 16 },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  recipeImage: { width: '100%', height: 160 },
  recipeCardBody: { padding: 14 },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  badgeCategory: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeCategoryText: { fontSize: 10, fontWeight: '800', color: '#B45309' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, fontWeight: '800', color: '#1F2937' },
  recipeTitle: { fontSize: 15, fontWeight: '800', color: '#1F2937' },
  recipeTitleAr: { fontSize: 12, color: '#6B7280', marginTop: 2, marginBottom: 10 },
  recipeMetaRow: { flexDirection: 'row', gap: 14, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaItemText: { fontSize: 11, color: '#6B7280', fontWeight: '600' },

  // Detail Modal
  detailSafe: { flex: 1, backgroundColor: '#FFFFFF' },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailHeaderTitle: { fontSize: 14, fontWeight: '800', color: '#1F2937', flex: 1, textAlign: 'center' },
  detailScroll: { paddingBottom: 40 },
  detailImage: { width: '100%', height: 220 },
  detailBody: { padding: 20 },
  detailTitle: { fontSize: 20, fontWeight: '900', color: '#1F2937' },
  detailTitleAr: { fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 16 },
  detailMetaGrid: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metaBox: { flex: 1, alignItems: 'center' },
  metaBoxLabel: { fontSize: 10, color: '#6B7280', fontWeight: '700' },
  metaBoxVal: { fontSize: 12, fontWeight: '900', color: '#1F2937', marginTop: 2 },
  detailSubHeading: { fontSize: 11, fontWeight: '900', color: '#B45309', letterSpacing: 1, marginBottom: 10 },
  ingredientsBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 14,
    gap: 8,
    marginBottom: 24,
  },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ingredientText: { fontSize: 12, color: '#78350F', fontWeight: '600', flex: 1 },
  instructionsStack: { gap: 10 },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stepNumBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  stepText: { flex: 1, fontSize: 12, color: '#374151', lineHeight: 18 },

  // Secret Pin Modal
  secretOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  secretCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    gap: 12,
  },
  secretTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  secretTitle: { fontSize: 17, fontWeight: '900', color: colors.ink },
  secretSub: { fontSize: 12, color: colors.mist, lineHeight: 17 },
  pinInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 6,
  },
  secretActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  secretCancelBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#F3F4F6' },
  secretCancelText: { fontSize: 12, fontWeight: '700', color: colors.mist },
  secretConfirmBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, backgroundColor: colors.primary },
  secretConfirmText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
});
