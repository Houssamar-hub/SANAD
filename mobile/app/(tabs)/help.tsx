import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
  TextInput,
} from 'react-native';
import { Header } from '../../src/components/Header';
import { colors } from '../../src/theme/colors';
import { useApp } from '../../src/store/appStore';
import { FALLBACK_CENTERS, apiClient } from '../../src/services/api';
import {
  PhoneCall,
  MapPin,
  CheckCircle2,
  Heart,
  Plus,
  Trash2,
  ShieldAlert,
  Search,
  RotateCcw,
  Building2,
  Globe,
  Mail,
  HelpCircle,
} from 'lucide-react-native';

const MOROCCAN_REGIONS = [
  'Toutes les régions',
  'Tanger-Tétouan-Al Hoceïma',
  'L\'Oriental',
  'Fès-Meknès',
  'Rabat-Salé-Kénitra',
  'Béni Mellal-Khénifra',
  'Casablanca-Settat',
  'Marrakech-Safi',
  'Drâa-Tafilalet',
  'Souss-Massa',
  'Guelmim-Oued Noun',
  'Laâyoune-Sakia El Hamra',
  'Dakhla-Oued Ed-Dahab',
];

const CATEGORIES = [
  { id: 'all', label: 'Toutes les catégories', labelAr: 'كل الفئات' },
  { id: 'lutte_violence', label: 'Lutte violences', labelAr: 'مناهضة العنف' },
  { id: 'droits_femmes', label: 'Droits des femmes', labelAr: 'حقوق النساء' },
  { id: 'assistance_juridique', label: 'Assistance juridique', labelAr: 'الدعم القانوني' },
  { id: 'hebergement', label: 'Hébergement d\'urgence', labelAr: 'الإيواء المستعجل' },
  { id: 'cyberharcelement', label: 'Cyberharcèlement', labelAr: 'العنف الرقمي' },
  { id: 'autonomisation', label: 'Autonomisation & Écoute', labelAr: 'التمكين والاستماع' },
];

const TYPES = [
  { id: 'all', label: 'Tous les types', labelAr: 'الكل' },
  { id: 'association', label: 'Associations (ONG)', labelAr: 'جمعيات المجتمع المدني' },
  { id: 'institution', label: 'Services Publics & Cellules', labelAr: 'مؤسسات وخلايا رسمية' },
];

export default function HelpScreen() {
  const { t, isRTL, trustedContacts, addTrustedContact, removeTrustedContact } = useApp();
  const [centers, setCenters] = useState<any[]>(FALLBACK_CENTERS);
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions');
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Emergency contact local state
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRel, setNewContactRel] = useState('Proche');

  // Load from API with query params or fallback
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedRegion !== 'Toutes les régions') params.append('region', selectedRegion);
    if (selectedCity !== 'Toutes') params.append('city', selectedCity);
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    if (selectedType !== 'all') params.append('type', selectedType);
    if (searchQuery.trim()) params.append('search', searchQuery.trim());

    const queryString = params.toString() ? `?${params.toString()}` : '';

    apiClient
      .get(`/centers${queryString}`)
      .then((res) => {
        if (res.data?.centers) {
          setCenters(res.data.centers);
        }
      })
      .catch(() => {
        // Local client-side filtering on FALLBACK_CENTERS
        let filtered = [...FALLBACK_CENTERS];
        if (selectedRegion !== 'Toutes les régions') {
          filtered = filtered.filter(
            (c) => c.region && c.region.toLowerCase() === selectedRegion.toLowerCase()
          );
        }
        if (selectedCity !== 'Toutes') {
          filtered = filtered.filter(
            (c) => c.city && c.city.toLowerCase() === selectedCity.toLowerCase()
          );
        }
        if (selectedCategory !== 'all') {
          filtered = filtered.filter((c) => c.category === selectedCategory);
        }
        if (selectedType !== 'all') {
          filtered = filtered.filter((c) => c.type === selectedType);
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              (c.nameAr && c.nameAr.includes(q)) ||
              (c.services && c.services.some((s: string) => s.toLowerCase().includes(q))) ||
              (c.city && c.city.toLowerCase().includes(q))
          );
        }
        setCenters(filtered);
      });
  }, [selectedRegion, selectedCity, selectedCategory, selectedType, searchQuery]);

  // Dynamic list of cities depending on selected region
  const availableCities = useMemo(() => {
    let source = FALLBACK_CENTERS;
    if (selectedRegion !== 'Toutes les régions') {
      source = FALLBACK_CENTERS.filter(
        (c) => c.region && c.region.toLowerCase() === selectedRegion.toLowerCase()
      );
    }
    const uniqueCities = Array.from(new Set(source.map((c) => c.city).filter(Boolean)));
    return ['Toutes', ...uniqueCities];
  }, [selectedRegion]);

  // When region changes, if current city is not in new region, reset to "Toutes"
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedCity('Toutes');
  };

  const handleResetFilters = () => {
    setSelectedRegion('Toutes les régions');
    setSelectedCity('Toutes');
    setSelectedCategory('all');
    setSelectedType('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedRegion !== 'Toutes les régions' ||
    selectedCity !== 'Toutes' ||
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    searchQuery.trim().length > 0;

  const confirmCall = (number: string, title: string) => {
    Alert.alert(t.emergencyConfirm, `${title} (${number})`, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.call,
        onPress: () => {
          Linking.openURL(`tel:${number}`).catch(() => {
            Alert.alert('Erreur', "Impossible de lancer l'appel direct sur cet appareil.");
          });
        },
      },
    ]);
  };

  const openUrl = (url: string) => {
    if (!url) return;
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    Linking.openURL(cleanUrl).catch(() => {
      Alert.alert('Lien inaccessible', `Impossible d'ouvrir l'adresse : ${url}`);
    });
  };

  const openEmail = (email: string) => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Email inaccessible', `Impossible d'ouvrir l'application de messagerie.`);
    });
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert('Attention', 'Indiquez un nom et un numéro de téléphone.');
      return;
    }
    addTrustedContact({
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRel,
    });
    setNewContactName('');
    setNewContactPhone('');
    setShowAddContact(false);
    Alert.alert('Enregistré', 'Contact de confiance stocké de manière sécurisée sur votre appareil.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTag}>ASSISTANCE D'URGENCE & ANNUAIRE MAROCAIN</Text>
          <Text style={[styles.pageTitle, isRTL && styles.rtl]}>{t.help.title}</Text>
          <Text style={[styles.pageSub, isRTL && styles.rtl]}>
            Annuaire vérifié des associations de protection des femmes et numéros d'urgence dans les 12 régions du Royaume.
          </Text>
        </View>

        {/* ── 3 BIG EMERGENCY CARDS ── */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyTopRow}>
            <ShieldAlert size={16} color={colors.terracotta} />
            <Text style={styles.emergencyTitle}>NUMÉROS D'URGENCE NATIONAUX (24H/24 · GRATUITS)</Text>
          </View>

          <View style={styles.hotlinesRow}>
            {/* Police 19 */}
            <TouchableOpacity
              style={styles.hotlineCol}
              onPress={() => confirmCall('19', 'Police Secours')}
              activeOpacity={0.8}
            >
              <Text style={[styles.hotlineDigit, { color: colors.terracotta }]}>19</Text>
              <Text style={styles.hotlineName}>Police</Text>
              <Text style={styles.hotlineZone}>Périmètre urbain</Text>
            </TouchableOpacity>

            <View style={styles.hotlineDivider} />

            {/* Gendarmerie 177 */}
            <TouchableOpacity
              style={styles.hotlineCol}
              onPress={() => confirmCall('177', 'Gendarmerie Royale')}
              activeOpacity={0.8}
            >
              <Text style={[styles.hotlineDigit, { color: colors.primary }]}>177</Text>
              <Text style={styles.hotlineName}>Gendarme</Text>
              <Text style={styles.hotlineZone}>Rural / Autoroute</Text>
            </TouchableOpacity>

            <View style={styles.hotlineDivider} />

            {/* Protection Civile 15 */}
            <TouchableOpacity
              style={styles.hotlineCol}
              onPress={() => confirmCall('15', 'Protection Civile')}
              activeOpacity={0.8}
            >
              <Text style={[styles.hotlineDigit, { color: colors.secondaryDark }]}>15</Text>
              <Text style={styles.hotlineName}>Protection</Text>
              <Text style={styles.hotlineZone}>Secours & Ambulances</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── TRUSTED CONTACTS CIRCLE ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTagRow}>
            <Heart size={14} color={colors.primary} />
            <Text style={styles.sectionHeading}>CERCLE DE CONFIANCE PRIVÉ</Text>
          </View>
          <Text style={[styles.sectionSubtitle, isRTL && styles.rtl]}>
            Vos contacts d'alerte immédiate enregistrés localement sur cet appareil.
          </Text>
        </View>

        <View style={styles.trustedContainer}>
          {trustedContacts.map((contact) => (
            <View key={contact.id} style={styles.trustedCard}>
              <View style={styles.trustedAvatar}>
                <Text style={styles.trustedAvatarText}>{contact.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.trustedInfo}>
                <Text style={styles.trustedName}>{contact.name}</Text>
                <Text style={styles.trustedMeta}>
                  {contact.phone} · {contact.relationship}
                </Text>
              </View>
              <View style={styles.trustedActions}>
                <TouchableOpacity
                  style={styles.actionCallBtn}
                  onPress={() => confirmCall(contact.phone, contact.name)}
                >
                  <PhoneCall size={14} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionDelBtn}
                  onPress={() => removeTrustedContact(contact.id)}
                >
                  <Trash2 size={14} color={colors.mist} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {showAddContact ? (
            <View style={styles.addForm}>
              <TextInput
                style={styles.formInput}
                placeholder="Prénom ou lien (ex: Mère, Amie Sara)"
                placeholderTextColor={colors.fog}
                value={newContactName}
                onChangeText={setNewContactName}
              />
              <TextInput
                style={styles.formInput}
                placeholder="Numéro de téléphone (ex: 06...)"
                placeholderTextColor={colors.fog}
                keyboardType="phone-pad"
                value={newContactPhone}
                onChangeText={setNewContactPhone}
              />
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.formCancelBtn}
                  onPress={() => setShowAddContact(false)}
                >
                  <Text style={styles.formCancelText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formSaveBtn} onPress={handleAddContact}>
                  <Text style={styles.formSaveText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addContactTrigger}
              onPress={() => setShowAddContact(true)}
              activeOpacity={0.8}
            >
              <Plus size={16} color={colors.primary} />
              <Text style={styles.addContactTriggerText}>Ajouter un contact de confiance</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── ASSOCIATIONS & REGIONAL DIRECTORY ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTagRow}>
            <Building2 size={14} color={colors.primary} />
            <Text style={styles.sectionHeading}>RÉSEAU NATIONAL DES ASSOCIATIONS ET CENTRES</Text>
          </View>
          <Text style={[styles.sectionSubtitle, isRTL && styles.rtl]}>
            Annuaire exhaustif des 12 régions administratives du Maroc : écoute, hébergement d'urgence, soutien juridique et autonomisation.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Search size={16} color={colors.mist} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, isRTL && styles.rtl]}
            placeholder="Rechercher une association, une ville ou un service..."
            placeholderTextColor={colors.fog}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClearBtn}>
              <Text style={styles.searchClearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 12 Regions Selector */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>RÉGION DU MAROC (12 RÉGIONS)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillScroll}
          >
            {MOROCCAN_REGIONS.map((region) => {
              const active = selectedRegion === region;
              return (
                <TouchableOpacity
                  key={region}
                  style={[styles.filterPill, active && styles.filterPillActive]}
                  onPress={() => handleRegionChange(region)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                    {region}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Dependent City Selector */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>VILLE DANS LA RÉGION</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillScroll}
          >
            {availableCities.map((city) => {
              const active = selectedCity === city;
              return (
                <TouchableOpacity
                  key={city}
                  style={[styles.cityPill, active && styles.cityPillActive]}
                  onPress={() => setSelectedCity(city)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.cityPillText, active && styles.cityPillTextActive]}>
                    {city}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Categories & Type Filters */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>DOMAINE D'INTERVENTION</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillScroll}
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryPill, active && styles.categoryPillActive]}
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.categoryPillText, active && styles.categoryPillTextActive]}>
                    {isRTL ? cat.labelAr : cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Type Filter Pills: Association vs Institution */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>TYPE D'ORGANISME</Text>
          <View style={styles.typeRow}>
            {TYPES.map((tp) => {
              const active = selectedType === tp.id;
              return (
                <TouchableOpacity
                  key={tp.id}
                  style={[styles.typePill, active && styles.typePillActive]}
                  onPress={() => setSelectedType(tp.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.typePillText, active && styles.typePillTextActive]}>
                    {isRTL ? tp.labelAr : tp.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Filter Meta Bar (Count + Reset button) */}
        <View style={styles.resultsBar}>
          <Text style={styles.resultsCount}>
            <Text style={styles.resultsCountBold}>{centers.length}</Text>{' '}
            {centers.length > 1 ? 'associations et centres trouvés' : 'organisme trouvé'}
          </Text>

          {hasActiveFilters && (
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetFilters}
              activeOpacity={0.8}
            >
              <RotateCcw size={12} color={colors.primary} />
              <Text style={styles.resetBtnText}>Réinitialiser</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Empty State */}
        {centers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <HelpCircle size={44} color={colors.fog} />
            <Text style={styles.emptyTitle}>Aucune association trouvée</Text>
            <Text style={styles.emptySub}>
              Aucun organisme ne correspond à vos filtres actuels dans cette zone. Essayez d'élargir la recherche ou de réinitialiser les critères.
            </Text>
            <TouchableOpacity style={styles.emptyResetBtn} onPress={handleResetFilters}>
              <Text style={styles.emptyResetText}>Afficher toutes les régions</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Centers Stack Cards */
          <View style={styles.centersStack}>
            {centers.map((center: any, idx: number) => {
              const displayName = isRTL && center.nameAr ? center.nameAr : center.name;
              const displayAddress = isRTL && center.addressAr ? center.addressAr : center.address;
              const displayDesc = isRTL && center.descriptionAr ? center.descriptionAr : center.description;
              const isInstitution = center.type === 'institution';

              return (
                <View key={center._id || idx} style={styles.centerItem}>
                  {/* Card Header Badges */}
                  <View style={styles.centerItemHeader}>
                    <View style={styles.badgeRow}>
                      <View style={styles.cityBadge}>
                        <MapPin size={11} color={colors.primary} />
                        <Text style={styles.cityBadgeText}>{center.city}</Text>
                      </View>
                      <View
                        style={[
                          styles.typeBadge,
                          isInstitution ? styles.typeBadgeInst : styles.typeBadgeAssoc,
                        ]}
                      >
                        <Text
                          style={[
                            styles.typeBadgeBaseText,
                            isInstitution ? styles.typeBadgeInstText : styles.typeBadgeAssocText,
                          ]}
                        >
                          {isInstitution ? 'Service Public' : 'ONG / Association'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.verifiedRow}>
                      <CheckCircle2 size={12} color={colors.secondaryDark} />
                      <Text style={styles.verifiedText}>Vérifié</Text>
                    </View>
                  </View>

                  {/* Association Name */}
                  <Text style={[styles.centerName, isRTL && styles.rtl]}>{displayName}</Text>

                  {/* Region indicator */}
                  {center.region && (
                    <Text style={styles.regionText}>
                      Région : <Text style={styles.regionTextBold}>{center.region}</Text>
                    </Text>
                  )}

                  {/* Description if available */}
                  {displayDesc && (
                    <Text style={[styles.centerDesc, isRTL && styles.rtl]} numberOfLines={3}>
                      {displayDesc}
                    </Text>
                  )}

                  {/* Address */}
                  {displayAddress && (
                    <Text style={[styles.centerAddress, isRTL && styles.rtl]}>
                      📍 {displayAddress}
                    </Text>
                  )}

                  {/* Services pills */}
                  {center.services && center.services.length > 0 && (
                    <View style={styles.servicePillGroup}>
                      {center.services.map((srv: string, sIdx: number) => (
                        <View key={sIdx} style={styles.serviceTag}>
                          <Text style={styles.serviceTagText}>{srv}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Primary Call CTA */}
                  <TouchableOpacity
                    style={styles.centerCallBtn}
                    onPress={() => confirmCall(center.phone, displayName)}
                    activeOpacity={0.85}
                  >
                    <PhoneCall size={14} color={colors.white} />
                    <Text style={styles.centerCallText}>
                      {t.help.callCenter} · {center.phone}
                    </Text>
                  </TouchableOpacity>

                  {/* Secondary Actions (Email & Website) */}
                  {(center.website || center.email) && (
                    <View style={styles.centerSecondaryActions}>
                      {center.website && (
                        <TouchableOpacity
                          style={styles.secondaryBtn}
                          onPress={() => openUrl(center.website)}
                          activeOpacity={0.8}
                        >
                          <Globe size={13} color={colors.primary} />
                          <Text style={styles.secondaryBtnText} numberOfLines={1}>
                            Site web officiel
                          </Text>
                        </TouchableOpacity>
                      )}
                      {center.email && (
                        <TouchableOpacity
                          style={styles.secondaryBtn}
                          onPress={() => openEmail(center.email)}
                          activeOpacity={0.8}
                        >
                          <Mail size={13} color={colors.slate} />
                          <Text style={styles.secondaryBtnText} numberOfLines={1}>
                            Envoyer un email
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {/* Verification source footnote */}
                  {center.sourceName && (
                    <Text style={styles.sourceFootnote}>
                      Source : {center.sourceName}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  rtl: { textAlign: 'right' },

  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.chalk,
  },
  pageTag: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  pageSub: {
    fontSize: 13,
    color: colors.mist,
    lineHeight: 18,
  },

  // BIG EMERGENCY CARD
  emergencyCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.chalk,
    padding: 18,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  emergencyTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  emergencyTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.terracotta,
    letterSpacing: 0.6,
  },
  hotlinesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotlineCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  hotlineDigit: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  hotlineName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 2,
  },
  hotlineZone: {
    fontSize: 10,
    color: colors.mist,
    marginTop: 2,
    textAlign: 'center',
  },
  hotlineDivider: {
    width: 1,
    height: 42,
    backgroundColor: colors.chalk,
  },

  // TRUSTED CONTACTS
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.slate,
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.mist,
    lineHeight: 17,
  },

  trustedContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  trustedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.chalk,
    gap: 12,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  trustedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustedAvatarText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
  },
  trustedInfo: { flex: 1 },
  trustedName: { fontSize: 14, fontWeight: '800', color: colors.ink },
  trustedMeta: { fontSize: 12, color: colors.mist, marginTop: 2 },
  trustedActions: { flexDirection: 'row', gap: 8 },
  actionCallBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionDelBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addContactTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    backgroundColor: colors.white,
  },
  addContactTriggerText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },

  addForm: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.chalk,
    gap: 10,
  },
  formInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  formCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  formCancelText: { fontSize: 12, fontWeight: '700', color: colors.mist },
  formSaveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  formSaveText: { fontSize: 12, fontWeight: '800', color: colors.white },

  // SEARCH BAR
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.chalk,
    height: 46,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 13, color: colors.ink },
  searchClearBtn: { padding: 6 },
  searchClearText: { fontSize: 14, color: colors.mist, fontWeight: '700' },

  // FILTER SECTIONS
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.mist,
    letterSpacing: 0.8,
    marginHorizontal: 20,
    marginBottom: 6,
  },
  filterPillScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.slate,
  },
  filterPillTextActive: {
    color: colors.white,
  },

  cityPill: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  cityPillActive: {
    backgroundColor: colors.secondaryDark,
    borderColor: colors.secondaryDark,
  },
  cityPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.slate,
  },
  cityPillTextActive: {
    color: colors.white,
  },

  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  categoryPillActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.slate,
  },
  categoryPillTextActive: {
    color: colors.white,
  },

  typeRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  typePill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  typePillActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  typePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.slate,
  },
  typePillTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },

  // RESULTS BAR
  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 12,
    color: colors.mist,
  },
  resultsCountBold: {
    fontWeight: '800',
    color: colors.ink,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },

  // EMPTY STATE
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 12,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: colors.mist,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyResetBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 14,
  },
  emptyResetText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },

  // CENTERS LIST
  centersStack: {
    paddingHorizontal: 16,
    gap: 12,
  },
  centerItem: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.chalk,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  centerItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cityBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeAssoc: {
    backgroundColor: colors.chalk,
  },
  typeBadgeBaseText: {
    fontSize: 10,
    fontWeight: '800',
  },
  typeBadgeAssocText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.slate,
  },
  typeBadgeInst: {
    backgroundColor: '#E0F2FE',
  },
  typeBadgeInstText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
  },

  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondaryDark,
  },

  centerName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 2,
  },
  regionText: {
    fontSize: 11,
    color: colors.mist,
    marginBottom: 6,
  },
  regionTextBold: {
    fontWeight: '700',
    color: colors.slate,
  },
  centerDesc: {
    fontSize: 12,
    color: colors.slate,
    lineHeight: 17,
    marginBottom: 8,
  },
  centerAddress: {
    fontSize: 11,
    color: colors.mist,
    marginBottom: 10,
    lineHeight: 16,
  },

  servicePillGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  serviceTag: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  serviceTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.slate,
  },

  centerCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 11,
    borderRadius: 14,
  },
  centerCallText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },

  centerSecondaryActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.chalk,
  },
  secondaryBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
  },
  sourceFootnote: {
    fontSize: 10,
    color: colors.mist,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
