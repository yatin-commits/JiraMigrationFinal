import { useEffect, useState } from "react";
import { fetchIssueTypes, fetchProjects, isLoggedIn } from "./services/apiClient";
import { UserContext } from "./UserContextInstance";

export const UserProvider = ({ children }) => {
	const [projects, setProjects] = useState([]);
	const [issueTypes, setIssueTypes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadInitialData = async () => {
			try {
				setLoading(true);
				if (!isLoggedIn()) {
					setLoading(false);
					return;
				}
				const [projectsData, issueTypesData] = await Promise.all([
					fetchProjects(),
					fetchIssueTypes(),
				]);
				const normalizedProjects = Array.isArray(projectsData?.data)
					? projectsData.data
					: Array.isArray(projectsData)
						? projectsData
						: [];
				const normalizedIssueTypes = Array.isArray(issueTypesData?.data)
					? issueTypesData.data
					: Array.isArray(issueTypesData)
						? issueTypesData
						: [];
				setProjects(normalizedProjects);
				setIssueTypes(normalizedIssueTypes);
			} catch (err) {
				console.error("Error loading initial data:", err);
				setError("Error loading projects and issue types: " + err.message);
			} finally {
				setLoading(false);
			}
		};

		loadInitialData();
	}, []);

	return (
		<UserContext.Provider
			value={{
				projects,
				issueTypes,
				loading,
				error,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};