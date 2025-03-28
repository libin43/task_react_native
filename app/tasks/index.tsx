import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Text, Provider as PaperProvider, Card, Title, Button, useTheme, IconButton, ActivityIndicator } from "react-native-paper";
import { router } from "expo-router";
import { GET_ALL_TASKS_API } from "@/api/getAllTasks";
import { handleApiError } from "@/utils/errorHandler";

type Task = {
    _id: string;
    title: string;
};

const HomeScreen = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    const handleOnRefresh = () => {
        setRefresh(true);
        fetchTasks();
        setRefresh(false);
    };

    const fetchTasks = async () => {
        setLoading(true);

        try {
            const response = await GET_ALL_TASKS_API()
            if (response.data.data) {
                setTasks(response.data.data);
            }
        } catch (error) {
            handleApiError(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View>
                <Text style={[styles.title, { color: theme.colors.primary }]}>My Tasks</Text>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} available
                </Text>
            </View>
            <IconButton
                icon="refresh"
                mode="contained"
                size={20}
                onPress={fetchTasks}
                iconColor={theme.colors.onPrimary}
                containerColor={theme.colors.primary}
            />
        </View>
    );

    return (
        <PaperProvider>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {renderHeader()}

                <Button
                    mode="contained"
                    onPress={() => router.push("/tasks/create")}
                    style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
                    icon="plus"
                >
                    Create Task
                </Button>

                {loading && !refresh ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={{ marginTop: 10, color: theme.colors.onSurfaceVariant }}>Loading your tasks...</Text>
                    </View>
                ) : tasks.length > 0 ? (
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={refresh}
                                onRefresh={handleOnRefresh}
                                colors={[theme.colors.primary]}
                                tintColor={theme.colors.primary}
                            />
                        }
                        // scrollIndicatorInsets={}
                        data={tasks}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <Card
                                style={[styles.taskCard, { backgroundColor: theme.colors.surface }]}
                                onPress={() => router.push(`/tasks/${item._id}`)}
                                mode="elevated"
                            >
                                <Card.Content>
                                    <View style={styles.taskRow}>
                                        <View style={styles.taskInfo}>
                                            <Title style={{ color: theme.colors.onSurface }}>{item.title}</Title>
                                        </View>
                                        <IconButton
                                            icon="chevron-right"
                                            size={24}
                                            iconColor={theme.colors.primary}
                                        />
                                    </View>
                                </Card.Content>
                            </Card>
                        )}
                        contentContainerStyle={styles.listContainer}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>No tasks yet</Text>
                        <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
                            Create a task to get started with your productivity journey
                        </Text>
                    </View>
                )}
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 5,
    },
    createButton: {
        marginBottom: 20,
        borderRadius: 8,
        paddingVertical: 6,
    },
    taskCard: {
        borderRadius: 12,
        elevation: 3,
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    taskInfo: {
        flex: 1,
    },
    listContainer: {
        paddingBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default HomeScreen;